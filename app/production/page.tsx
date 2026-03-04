'use client'

import { useEffect, useState, useCallback } from 'react'

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

interface ProductionData {
  breakdown: Record<string, Record<string, number>>
  totals: Record<string, number>
  dayTotals: Record<string, number>
  grandTotal: number
  weeks: { label: string; dates: Record<string, string> }[]
  subscriberCount: number
  varieties: string[]
}

export default function ProductionPage() {
  const [data, setData] = useState<ProductionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-lg text-gray-600">Loading production data...</p>
      </div>
    )
  }

  if (error || !data) {
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

  const { breakdown, totals, dayTotals, grandTotal, weeks, subscriberCount, varieties } = data
  const days = ['thursday', 'friday', 'saturday']

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Baking Production</h1>
            <p className="text-gray-600 mt-1">
              {subscriberCount} active subscriber{subscriberCount !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={fetchData}
            className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium"
            style={{ backgroundColor: '#5B7C99' }}
          >
            Refresh
          </button>
        </div>

        {grandTotal === 0 && (
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

        {/* Production Table */}
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
  )
}
