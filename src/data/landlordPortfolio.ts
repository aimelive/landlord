/**
 * Mock landlord portfolio data for the landlord dashboard.
 * All amounts in RWF. "Today" is treated as 2026-04-18 so paid/pending/overdue
 * rows look natural relative to it.
 */

export type PaymentStatus = 'paid' | 'pending' | 'overdue'
export type ActivityType =
  | 'payment_received'
  | 'lease_signed'
  | 'tenant_joined'
  | 'reminder_sent'
  | 'maintenance'

export interface LandlordProperty {
  id: string
  name: string
  address: string
  units: number
  occupied: number
  monthly_revenue: number
}

export interface UpcomingPayment {
  id: string
  tenant_name: string
  property_id: string
  property_name: string
  unit: string
  amount: number
  due_date: string // ISO
  status: PaymentStatus
}

export interface LeaseEnding {
  id: string
  tenant_name: string
  property_name: string
  unit: string
  lease_end: string // ISO
  monthly_rent: number
}

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  subtitle: string
  amount?: number
  timestamp: string // ISO
}

export const landlordPortfolio = {
  properties: [
    { id: 'p1', name: 'Kimihurura Apartments', address: 'KN 5 Ave, Kigali',  units: 12, occupied: 10, monthly_revenue: 2_850_000 },
    { id: 'p2', name: 'Nyarutarama Estate',    address: 'KG 9 Ave, Kigali',  units: 6,  occupied: 6,  monthly_revenue: 2_625_000 },
    { id: 'p3', name: 'Kacyiru Villa',         address: 'KG 17 Ave, Kigali', units: 4,  occupied: 2,  monthly_revenue: 1_200_000 },
  ] as LandlordProperty[],

  upcoming_payments: [
    { id: 'up1', tenant_name: 'Jean Habimana',    property_id: 'p1', property_name: 'Kimihurura Apartments', unit: '3B', amount: 275_000, due_date: '2026-04-01', status: 'paid' },
    { id: 'up2', tenant_name: 'Marie Uwimana',    property_id: 'p2', property_name: 'Nyarutarama Estate',    unit: '2A', amount: 450_000, due_date: '2026-04-01', status: 'paid' },
    { id: 'up3', tenant_name: 'Eric Nkusi',       property_id: 'p1', property_name: 'Kimihurura Apartments', unit: '5A', amount: 250_000, due_date: '2026-04-05', status: 'paid' },
    { id: 'up4', tenant_name: 'Beatrice Mutesi',  property_id: 'p2', property_name: 'Nyarutarama Estate',    unit: '1C', amount: 475_000, due_date: '2026-04-20', status: 'pending' },
    { id: 'up5', tenant_name: 'Claude Niyonsaba', property_id: 'p3', property_name: 'Kacyiru Villa',         unit: '1A', amount: 600_000, due_date: '2026-04-22', status: 'pending' },
    { id: 'up6', tenant_name: 'Grace Iradukunda', property_id: 'p1', property_name: 'Kimihurura Apartments', unit: '7B', amount: 300_000, due_date: '2026-04-25', status: 'pending' },
    { id: 'up7', tenant_name: 'Daniel Kagame',    property_id: 'p2', property_name: 'Nyarutarama Estate',    unit: '3A', amount: 425_000, due_date: '2026-04-28', status: 'pending' },
    { id: 'up8', tenant_name: 'Patrick Uwase',    property_id: 'p3', property_name: 'Kacyiru Villa',         unit: '2A', amount: 600_000, due_date: '2026-03-28', status: 'overdue' },
  ] as UpcomingPayment[],

  leases_ending: [
    { id: 'l1', tenant_name: 'Eric Nkusi',      property_name: 'Kimihurura Apartments', unit: '5A', lease_end: '2026-05-15', monthly_rent: 250_000 },
    { id: 'l2', tenant_name: 'Marie Uwimana',   property_name: 'Nyarutarama Estate',    unit: '2A', lease_end: '2026-06-01', monthly_rent: 450_000 },
    { id: 'l3', tenant_name: 'Daniel Kagame',   property_name: 'Nyarutarama Estate',    unit: '3A', lease_end: '2026-06-10', monthly_rent: 425_000 },
  ] as LeaseEnding[],

  recent_activity: [
    { id: 'a1', type: 'payment_received', title: 'Rent received from Eric Nkusi',      subtitle: 'Kimihurura Apartments · 5A',  amount: 250_000, timestamp: '2026-04-17T14:32:00Z' },
    { id: 'a2', type: 'reminder_sent',    title: 'Reminder sent to Patrick Uwase',     subtitle: 'Overdue rent · Kacyiru Villa 2A',                 timestamp: '2026-04-17T09:15:00Z' },
    { id: 'a3', type: 'payment_received', title: 'Rent received from Marie Uwimana',   subtitle: 'Nyarutarama Estate · 2A',     amount: 450_000, timestamp: '2026-04-12T11:04:00Z' },
    { id: 'a4', type: 'tenant_joined',    title: 'New tenant: Jean Habimana',          subtitle: 'Kimihurura Apartments · 3B',                       timestamp: '2026-04-08T16:40:00Z' },
    { id: 'a5', type: 'lease_signed',     title: 'Lease renewed · Beatrice Mutesi',    subtitle: '12-month renewal · Nyarutarama 1C',                timestamp: '2026-04-04T10:22:00Z' },
  ] as ActivityItem[],
}

// ── Derived metrics ──────────────────────────────────────────────────────────

export const TODAY = new Date('2026-04-18')

export function totalUnits(): number {
  return landlordPortfolio.properties.reduce((s, p) => s + p.units, 0)
}

export function occupiedUnits(): number {
  return landlordPortfolio.properties.reduce((s, p) => s + p.occupied, 0)
}

export function occupancyPct(): number {
  const total = totalUnits()
  return total === 0 ? 0 : Math.round((occupiedUnits() / total) * 100)
}

export function expectedMonthlyRevenue(): number {
  return landlordPortfolio.properties.reduce((s, p) => s + p.monthly_revenue, 0)
}

export function collectedThisMonth(): number {
  return landlordPortfolio.upcoming_payments
    .filter((p) => p.status === 'paid' && p.due_date.startsWith('2026-04'))
    .reduce((s, p) => s + p.amount, 0)
}

export function pendingThisMonth(): number {
  return landlordPortfolio.upcoming_payments
    .filter((p) => p.status === 'pending' && p.due_date.startsWith('2026-04'))
    .reduce((s, p) => s + p.amount, 0)
}

export function overduePayments(): UpcomingPayment[] {
  return landlordPortfolio.upcoming_payments.filter((p) => p.status === 'overdue')
}

export function overdueAmount(): number {
  return overduePayments().reduce((s, p) => s + p.amount, 0)
}

// ── Formatting helpers ──────────────────────────────────────────────────────

const moneyFmt = new Intl.NumberFormat('en-RW', {
  style: 'currency',
  currency: 'RWF',
  maximumFractionDigits: 0,
})

export function formatRWF(amount: number): string {
  return moneyFmt.format(amount)
}

export function formatRWFCompact(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M RWF`
  if (amount >= 1_000) return `${Math.round(amount / 1_000)}K RWF`
  return `${amount} RWF`
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/** "2h ago", "Yesterday", "Apr 4" — relative for recent items, absolute for old. */
export function relativeTime(iso: string, now: Date = TODAY): string {
  const then = new Date(iso)
  const diffMs = now.getTime() - then.getTime()
  const diffMin = Math.round(diffMs / 60_000)
  const diffHr = Math.round(diffMs / 3_600_000)
  const diffDay = Math.round(diffMs / 86_400_000)

  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay}d ago`
  return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/** Days between now and the given ISO date (negative if in the past). */
export function daysUntil(iso: string, now: Date = TODAY): number {
  const then = new Date(iso)
  return Math.round((then.getTime() - now.getTime()) / 86_400_000)
}
