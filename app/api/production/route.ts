import { NextResponse } from 'next/server'
import {
  stripe,
  STRIPE_PRICE_ID_ONE_LOAF,
  STRIPE_PRICE_ID_TWO_LOAF,
  STRIPE_PRICE_ID_RESTAURANT,
  STRIPE_PRICE_ID_GROCERY,
} from '@/lib/stripe/server'
import { createServerClient } from '@/lib/supabase/server'

const VARIETIES = ['original', 'everything', 'jalapeno'] as const
type Variety = (typeof VARIETIES)[number]
type DayBreakdown = Record<Variety, number>
type DeliveryDay = 'thursday' | 'friday' | 'saturday'

function emptyBreakdown(): DayBreakdown {
  return { original: 0, everything: 0, jalapeno: 0 }
}

function normalizeDay(raw: string | undefined): DeliveryDay {
  const lower = (raw || '').toLowerCase().trim()
  if (lower === 'friday') return 'friday'
  if (lower === 'saturday') return 'saturday'
  return 'thursday'
}

function getUpcomingWeeks(count: number) {
  const weeks: { label: string; dates: Record<DeliveryDay, string> }[] = []
  const now = new Date()
  // Find the next Thursday
  const dayOfWeek = now.getDay()
  const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7
  const nextThursday = new Date(now)
  nextThursday.setDate(now.getDate() + daysUntilThursday)

  for (let w = 0; w < count; w++) {
    const thu = new Date(nextThursday)
    thu.setDate(nextThursday.getDate() + w * 7)
    const fri = new Date(thu)
    fri.setDate(thu.getDate() + 1)
    const sat = new Date(fri)
    sat.setDate(fri.getDate() + 1)

    const fmt = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    weeks.push({
      label: `Week of ${fmt(thu)}`,
      dates: {
        thursday: fmt(thu),
        friday: fmt(fri),
        saturday: fmt(sat),
      },
    })
  }
  return weeks
}

export async function GET() {
  try {
    // Fetch all active subscriptions with customer data
    const subscriptions: Awaited<ReturnType<typeof stripe.subscriptions.list>>['data'] = []
    for await (const sub of stripe.subscriptions.list({
      status: 'active',
      expand: ['data.customer', 'data.items.data.price'],
      limit: 100,
    })) {
      subscriptions.push(sub)
    }

    // Filter out paused subscriptions
    const active = subscriptions.filter((sub) => !sub.pause_collection)

    // Get all stripe customer IDs to batch-query Supabase
    const customerIds = active.map((sub) => {
      const customer = sub.customer as { id: string }
      return customer.id
    })

    const supabase = createServerClient()
    const { data: customerRows } = await supabase
      .from('customers')
      .select('stripe_customer_id, bread_selections')
      .in('stripe_customer_id', customerIds)

    const selectionsMap = new Map<string, string[] | Record<string, number>>()
    for (const row of customerRows || []) {
      if (row.bread_selections) {
        selectionsMap.set(row.stripe_customer_id, row.bread_selections)
      }
    }

    // Aggregate counts
    const breakdown: Record<DeliveryDay, DayBreakdown> = {
      thursday: emptyBreakdown(),
      friday: emptyBreakdown(),
      saturday: emptyBreakdown(),
    }

    let subscriberCount = 0

    for (const sub of active) {
      const customer = sub.customer as {
        id: string
        metadata?: Record<string, string>
      }
      const priceId = sub.items.data[0]?.price?.id
      const quantity = sub.items.data[0]?.quantity || 1
      let loafCount: number
      if (priceId === STRIPE_PRICE_ID_ONE_LOAF) {
        loafCount = 1
      } else if (priceId === STRIPE_PRICE_ID_TWO_LOAF) {
        loafCount = 2
      } else if (priceId === STRIPE_PRICE_ID_RESTAURANT || priceId === STRIPE_PRICE_ID_GROCERY) {
        loafCount = quantity
      } else {
        loafCount = 1
      }

      const day = normalizeDay(customer.metadata?.delivery_day)

      // Resolve bread selections: Supabase → Stripe metadata → default
      let rawSelections = selectionsMap.get(customer.id) || null

      if (!rawSelections && customer.metadata?.bread_selections) {
        try {
          rawSelections = JSON.parse(customer.metadata.bread_selections)
        } catch {
          rawSelections = null
        }
      }

      // Handle object format { original: 10, everything: 5 } or array format ["original", "everything"]
      if (rawSelections && !Array.isArray(rawSelections) && typeof rawSelections === 'object') {
        for (const [variety, count] of Object.entries(rawSelections)) {
          const v = (VARIETIES.includes(variety as Variety) ? variety : 'original') as Variety
          breakdown[day][v] += count as number
        }
        // Check if object total covers all loaves, fill remainder with original
        const objectTotal = Object.values(rawSelections).reduce((s: number, n) => s + (n as number), 0)
        if (objectTotal < loafCount) {
          breakdown[day].original += loafCount - objectTotal
        }
      } else {
        // Array format or default
        let selections: string[] = Array.isArray(rawSelections) && rawSelections.length > 0
          ? rawSelections as string[]
          : Array(loafCount).fill('original')

        while (selections.length < loafCount) {
          selections.push(selections[0] || 'original')
        }

        for (let i = 0; i < loafCount; i++) {
          const variety = (selections[i] || 'original') as Variety
          if (VARIETIES.includes(variety)) {
            breakdown[day][variety]++
          } else {
            breakdown[day].original++
          }
        }
      }

      subscriberCount++
    }

    // Compute totals
    const days: DeliveryDay[] = ['thursday', 'friday', 'saturday']
    const totals = emptyBreakdown()
    const dayTotals: Record<DeliveryDay, number> = {
      thursday: 0,
      friday: 0,
      saturday: 0,
    }

    for (const day of days) {
      for (const v of VARIETIES) {
        totals[v] += breakdown[day][v]
        dayTotals[day] += breakdown[day][v]
      }
    }

    const grandTotal = VARIETIES.reduce((sum, v) => sum + totals[v], 0)
    const weeks = getUpcomingWeeks(3)

    return NextResponse.json({
      breakdown,
      totals,
      dayTotals,
      grandTotal,
      weeks,
      subscriberCount,
      varieties: VARIETIES,
    })
  } catch (error) {
    console.error('Production API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch production data' },
      { status: 500 }
    )
  }
}
