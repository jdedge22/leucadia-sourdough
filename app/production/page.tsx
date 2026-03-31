'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

const VARIETY_LABELS: Record<string, string> = {
  original: 'Original',
  everything: 'Everything Bagel',
  jalapeno: 'Jalapeño & Cheddar',
}

const DAY_LABELS: Record<string, string> = {
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
}

const PREP_DAY_LABELS: Record<string, string> = {
  thursday: 'Wednesday',
  friday: 'Thursday',
  saturday: 'Friday',
}

// ── Recipe constants (per 800g loaf) ──
const RECIPE = {
  loafWeight: 800,
  flour: 460,     // 100%
  water: 322,     // 70%
  starter: 92,    // 20%
  salt: 9,        // 2%
}

const ADD_INS: Record<string, { label: string; grams: number }[]> = {
  original: [],
  everything: [{ label: 'Everything Bagel Seasoning', grams: 30 }],
  jalapeno: [
    { label: 'Jalapeños (diced)', grams: 60 },
    { label: 'Cheddar (cubed)', grams: 80 },
  ],
}

interface ProductionData {
  breakdown: Record<string, Record<string, number>>
  totals: Record<string, number>
  dayTotals: Record<string, number>
  grandTotal: number
  weeks: { label: string; dates: Record<string, string> }[]
  subscriberCount: number
  varieties: string[]
}

function gramsToDisplay(g: number): string {
  if (g >= 1000) {
    return `${(g / 1000).toFixed(2)} kg`
  }
  return `${Math.round(g)} g`
}

export default function ProductionPage() {
  const [data, setData] = useState<ProductionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/production')
      if (!res.ok) throw new Error('Failed to fetch')
      setData(await res.json())
    } catch {
      setError('Failed to load production data')
    } finally {
      setLoading(false)
    }
  }, [])

  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Preview data: 72 original, 36 jalapeno, 36 everything spread across Thu/Fri/Sat
  const PREVIEW_DATA: ProductionData = {
    breakdown: {
      thursday: { original: 24, everything: 12, jalapeno: 12 },
      friday: { original: 24, everything: 12, jalapeno: 12 },
      saturday: { original: 24, everything: 12, jalapeno: 12 },
    },
    totals: { original: 72, everything: 36, jalapeno: 36 },
    dayTotals: { thursday: 48, friday: 48, saturday: 48 },
    grandTotal: 144,
    weeks: (() => {
      const w: ProductionData['weeks'] = []
      const now = new Date()
      const dow = now.getDay()
      const daysUntilThu = (4 - dow + 7) % 7 || 7
      const nextThu = new Date(now)
      nextThu.setDate(now.getDate() + daysUntilThu)
      const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      for (let i = 0; i < 3; i++) {
        const thu = new Date(nextThu); thu.setDate(nextThu.getDate() + i * 7)
        const fri = new Date(thu); fri.setDate(thu.getDate() + 1)
        const sat = new Date(fri); sat.setDate(fri.getDate() + 1)
        w.push({ label: `Week of ${fmt(thu)}`, dates: { thursday: fmt(thu), friday: fmt(fri), saturday: fmt(sat) } })
      }
      return w
    })(),
    subscriberCount: 72,
    varieties: ['original', 'everything', 'jalapeno'],
  }

  const activeData = previewMode ? PREVIEW_DATA : data

  function handlePrint() {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-lg text-gray-600">Loading production data...</p>
      </div>
    )
  }

  if (error || (!data && !previewMode)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'No data'}</p>
          <button
            onClick={fetchData}
            className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
            style={{ backgroundColor: '#5B7C99' }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const displayData = activeData!
  const { breakdown, totals, dayTotals, grandTotal, weeks, subscriberCount, varieties } = displayData
  const days = ['thursday', 'friday', 'saturday'] as const

  // Calculate dough ingredients for a given loaf count
  function calcIngredients(loafCount: number) {
    return {
      flour: RECIPE.flour * loafCount,
      water: RECIPE.water * loafCount,
      starter: RECIPE.starter * loafCount,
      salt: RECIPE.salt * loafCount,
      totalDough: RECIPE.loafWeight * loafCount,
    }
  }

  // Calculate add-ins for a day
  function calcAddIns(dayBreakdown: Record<string, number>) {
    const items: { label: string; grams: number }[] = []
    for (const variety of varieties) {
      const count = dayBreakdown[variety] || 0
      if (count === 0) continue
      for (const addIn of ADD_INS[variety] || []) {
        const existing = items.find((i) => i.label === addIn.label)
        if (existing) {
          existing.grams += addIn.grams * count
        } else {
          items.push({ label: addIn.label, grams: addIn.grams * count })
        }
      }
    }
    return items
  }

  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          nav, footer, .no-print { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-area { padding: 0 !important; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      <div ref={printRef} className="min-h-screen bg-amber-50 py-8 px-4 print-area">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 no-print">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Baking Production</h1>
              <p className="text-gray-600 mt-1">
                {subscriberCount} active subscriber{subscriberCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-lg transition text-sm font-medium border-2 ${
                  previewMode
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {previewMode ? 'Preview Mode' : 'Show Preview'}
              </button>
              <button
                onClick={handlePrint}
                className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:border-gray-400 transition text-sm font-medium"
              >
                Print Schedule
              </button>
              <button
                onClick={fetchData}
                className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium"
                style={{ backgroundColor: '#5B7C99' }}
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Print Header */}
          <div className="hidden print:block mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Leucadia Sourdough — Baking Schedule</h1>
            <p className="text-gray-600">
              Generated {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}{subscriberCount} active subscribers · {grandTotal} loaves/week
            </p>
          </div>

          {previewMode && (
            <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-4 mb-6 text-center no-print">
              <p className="text-amber-800 font-medium">
                Preview Mode — showing sample data (72 Original, 36 Everything, 36 Jalapeño per week)
              </p>
            </div>
          )}

          {grandTotal === 0 && !previewMode && (
            <div className="bg-white rounded-lg shadow p-6 mb-8 text-center text-gray-500">
              No active subscriptions found. Counts will appear here once subscribers sign up.
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {varieties.map((v) => (
              <div key={v} className="bg-white rounded-lg shadow p-5">
                <p className="text-sm text-gray-500 font-medium">{VARIETY_LABELS[v] || v}</p>
                <p className="text-3xl font-bold mt-1" style={{ color: '#5B7C99' }}>
                  {totals[v]}
                </p>
                <p className="text-xs text-gray-400 mt-1">loaves / week</p>
              </div>
            ))}
            <div className="bg-white rounded-lg shadow p-5 border-2" style={{ borderColor: '#5B7C99' }}>
              <p className="text-sm font-medium" style={{ color: '#5B7C99' }}>
                Total
              </p>
              <p className="text-3xl font-bold mt-1 text-gray-900">{grandTotal}</p>
              <p className="text-xs text-gray-400 mt-1">loaves / week</p>
            </div>
          </div>

          {/* ── Day-by-Day Prep & Bake Schedule ── */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Prep & Bake Schedule</h2>

            {days.map((bakeDay) => {
              const dayCount = dayTotals[bakeDay]
              if (dayCount === 0) return null

              const dayIngredients = calcIngredients(dayCount)
              const dayAddIns = calcAddIns(breakdown[bakeDay])
              const prepDay = PREP_DAY_LABELS[bakeDay]

              return (
                <div key={bakeDay} className="bg-white rounded-lg shadow mb-6 overflow-hidden">
                  {/* Day header */}
                  <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: '#f8f5f0' }}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-900">
                        {DAY_LABELS[bakeDay]} Delivery — {dayCount} loaves
                      </h3>
                      <span className="text-sm text-gray-500 font-medium">
                        Prep: {prepDay} · Bake: {DAY_LABELS[bakeDay]}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Loaf breakdown */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Loaf Breakdown</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {varieties.map((v) => {
                          const count = breakdown[bakeDay][v]
                          if (count === 0) return null
                          return (
                            <div key={v} className="bg-gray-50 rounded-lg p-3 text-center">
                              <p className="text-2xl font-bold text-gray-900">{count}</p>
                              <p className="text-sm text-gray-600">{VARIETY_LABELS[v]}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-4">
                          <div className="w-28 flex-shrink-0">
                            <span className="text-xs font-bold text-white px-2 py-1 rounded" style={{ backgroundColor: '#d97706' }}>
                              {prepDay} AM
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Feed Levain</p>
                            <p className="text-sm text-gray-600">
                              Need {gramsToDisplay(dayIngredients.starter)} mature starter by afternoon
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-28 flex-shrink-0">
                            <span className="text-xs font-bold text-white px-2 py-1 rounded" style={{ backgroundColor: '#d97706' }}>
                              {prepDay} PM
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Mix Dough & Shape</p>
                            <p className="text-sm text-gray-600">
                              Mix {dayCount} doughs, shape into bannetons, refrigerate 24 hrs
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-28 flex-shrink-0">
                            <span className="text-xs font-bold text-white px-2 py-1 rounded" style={{ backgroundColor: '#5B7C99' }}>
                              {DAY_LABELS[bakeDay]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Bake & Deliver</p>
                            <p className="text-sm text-gray-600">
                              Score & bake {dayCount} loaves straight from fridge
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dough Calculator */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Base Dough — {dayCount} loaves
                        </h4>
                        <table className="w-full text-sm">
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 text-gray-700">Flour</td>
                              <td className="py-2 text-right font-semibold text-gray-900">{gramsToDisplay(dayIngredients.flour)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 text-gray-700">Water (70%)</td>
                              <td className="py-2 text-right font-semibold text-gray-900">{gramsToDisplay(dayIngredients.water)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 text-gray-700">Starter (20%)</td>
                              <td className="py-2 text-right font-semibold text-gray-900">{gramsToDisplay(dayIngredients.starter)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 text-gray-700">Salt (2%)</td>
                              <td className="py-2 text-right font-semibold text-gray-900">{gramsToDisplay(dayIngredients.salt)}</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-semibold text-gray-900">Total Dough</td>
                              <td className="py-2 text-right font-bold text-gray-900">{gramsToDisplay(dayIngredients.totalDough)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {dayAddIns.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Add-Ins
                          </h4>
                          <table className="w-full text-sm">
                            <tbody>
                              {dayAddIns.map((item) => (
                                <tr key={item.label} className="border-b border-gray-100">
                                  <td className="py-2 text-gray-700">{item.label}</td>
                                  <td className="py-2 text-right font-semibold text-gray-900">{gramsToDisplay(item.grams)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Weekly Totals / Shopping List ── */}
          <div className="print-break mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Ingredient Totals</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Base Ingredients — {grandTotal} loaves
                    </h4>
                    {(() => {
                      const weekly = calcIngredients(grandTotal)
                      return (
                        <table className="w-full text-sm">
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 text-gray-700">Flour</td>
                              <td className="py-2 text-right font-semibold text-gray-900">{gramsToDisplay(weekly.flour)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 text-gray-700">Water</td>
                              <td className="py-2 text-right font-semibold text-gray-900">{gramsToDisplay(weekly.water)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 text-gray-700">Starter</td>
                              <td className="py-2 text-right font-semibold text-gray-900">{gramsToDisplay(weekly.starter)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 text-gray-700">Salt</td>
                              <td className="py-2 text-right font-semibold text-gray-900">{gramsToDisplay(weekly.salt)}</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-semibold text-gray-900">Total Dough</td>
                              <td className="py-2 text-right font-bold text-gray-900">{gramsToDisplay(weekly.totalDough)}</td>
                            </tr>
                          </tbody>
                        </table>
                      )
                    })()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Weekly Add-Ins
                    </h4>
                    {(() => {
                      const allAddIns: { label: string; grams: number }[] = []
                      for (const day of days) {
                        const items = calcAddIns(breakdown[day])
                        for (const item of items) {
                          const existing = allAddIns.find((a) => a.label === item.label)
                          if (existing) {
                            existing.grams += item.grams
                          } else {
                            allAddIns.push({ ...item })
                          }
                        }
                      }
                      if (allAddIns.length === 0) {
                        return <p className="text-sm text-gray-400">No add-ins this week</p>
                      }
                      return (
                        <table className="w-full text-sm">
                          <tbody>
                            {allAddIns.map((item) => (
                              <tr key={item.label} className="border-b border-gray-100">
                                <td className="py-2 text-gray-700">{item.label}</td>
                                <td className="py-2 text-right font-semibold text-gray-900">{gramsToDisplay(item.grams)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Production Table (original) ── */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Weekly Breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-5 py-3 font-semibold text-gray-600">Day</th>
                    {varieties.map((v) => (
                      <th key={v} className="px-5 py-3 font-semibold text-gray-600 text-right">
                        {VARIETY_LABELS[v] || v}
                      </th>
                    ))}
                    <th className="px-5 py-3 font-semibold text-gray-600 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <tr key={day} className="border-t border-gray-100">
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {DAY_LABELS[day]}
                      </td>
                      {varieties.map((v) => (
                        <td key={v} className="px-5 py-3 text-right text-gray-700">
                          {breakdown[day][v]}
                        </td>
                      ))}
                      <td className="px-5 py-3 text-right font-semibold text-gray-900">
                        {dayTotals[day]}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 bg-gray-50">
                    <td className="px-5 py-3 font-semibold text-gray-900">Total</td>
                    {varieties.map((v) => (
                      <td key={v} className="px-5 py-3 text-right font-semibold" style={{ color: '#5B7C99' }}>
                        {totals[v]}
                      </td>
                    ))}
                    <td className="px-5 py-3 text-right font-bold text-gray-900">{grandTotal}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 3-Week Forecast */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">3-Week Forecast</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {weeks.map((week) => (
                <div key={week.label} className="bg-white rounded-lg shadow p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">{week.label}</h3>
                  {days.map((day) => (
                    <div key={day} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">
                        {DAY_LABELS[day]} {week.dates[day]}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {dayTotals[day]} loaves
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 mt-1">
                    <span className="text-sm font-semibold" style={{ color: '#5B7C99' }}>
                      Week total
                    </span>
                    <span className="text-sm font-bold text-gray-900">{grandTotal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
