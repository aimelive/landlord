import { rentLedger } from '../data/rentTransactions'

type Payment = (typeof rentLedger.payments)[number]

export function formatMoney(amount: number, currency: string): string {
  return `${amount.toLocaleString('en-US')} ${currency}`
}

export function totalPaid(payments: readonly Payment[]): number {
  return payments.reduce((sum, p) => sum + p.amount, 0)
}

export function uniqueCoveredMonths(payments: readonly Payment[]): string[] {
  const set = new Set<string>()
  for (const p of payments) {
    for (const m of p.coveredMonths) {
      set.add(m)
    }
  }
  return [...set].sort()
}

const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const LONG_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export function monthToLabel(ym: string): string {
  const [year, month] = ym.split('-')
  return `${SHORT_MONTHS[parseInt(month) - 1]} ${year}`
}

export function monthToLongLabel(ym: string): string {
  const [year, month] = ym.split('-')
  return `${LONG_MONTHS[parseInt(month) - 1]} ${year}`
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${parseInt(day)} ${SHORT_MONTHS[parseInt(month) - 1]} ${year}`
}

export function buildMonthCoverageIndex(payments: readonly Payment[]): Map<string, Payment> {
  const map = new Map<string, Payment>()
  for (const p of payments) {
    for (const m of p.coveredMonths) {
      if (!map.has(m)) {
        map.set(m, p)
      }
    }
  }
  return map
}

export function lastCoveredMonth(coveredMonths: string[]): string {
  if (coveredMonths.length === 0) return ''
  const sorted = [...coveredMonths].sort()
  return sorted[sorted.length - 1]
}

export function coverageStatusMessage(lastMonth: string): string {
  if (!lastMonth) return 'No coverage data.'
  const [year, month] = lastMonth.split('-')
  const nextMonthNum = parseInt(month) + 1
  const nextYear = nextMonthNum > 12 ? parseInt(year) + 1 : parseInt(year)
  const nextMonthStr = nextMonthNum > 12 ? '01' : String(nextMonthNum).padStart(2, '0')
  const nextYm = `${nextYear}-${nextMonthStr}`
  return `Covered through ${monthToLongLabel(lastMonth)}. Not covered from ${monthToLongLabel(nextYm)} onward unless a new payment is added.`
}
