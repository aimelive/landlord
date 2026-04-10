export const rentLedger = {
  title: "LandLord | Rent Transactions",
  currency: "Rwf",
  coverageCycleAnchorDay: 28,
  payments: [
    {
      paidOn: "2024-08-28",
      amount: 800000,
      notes: "Covers Sep–Nov + caution",
      coveredMonths: ["2024-09", "2024-10", "2024-11"],
      coveredPeriods: [
        { start: "2024-08-28", end: "2024-09-28", label: "September 2024" },
        { start: "2024-09-28", end: "2024-10-28", label: "October 2024" },
        { start: "2024-10-28", end: "2024-11-28", label: "November 2024" }
      ]
    },
    {
      paidOn: "2024-11-28",
      amount: 400000,
      notes: "Covers Dec–Jan",
      coveredMonths: ["2024-12", "2025-01"],
      coveredPeriods: [
        { start: "2024-11-28", end: "2024-12-28", label: "December 2024" },
        { start: "2024-12-28", end: "2025-01-28", label: "January 2025" }
      ]
    },
    {
      paidOn: "2025-01-28",
      amount: 600000,
      notes: "Covers Feb–Apr",
      coveredMonths: ["2025-02", "2025-03", "2025-04"],
      coveredPeriods: [
        { start: "2025-01-28", end: "2025-02-28", label: "February 2025" },
        { start: "2025-02-28", end: "2025-03-28", label: "March 2025" },
        { start: "2025-03-28", end: "2025-04-28", label: "April 2025" }
      ]
    },
    {
      paidOn: "2025-07-12",
      amount: 1000000,
      notes: "Covers May–Sept",
      coveredMonths: ["2025-05", "2025-06", "2025-07", "2025-08", "2025-09"],
      coveredPeriods: [
        { start: "2025-04-28", end: "2025-05-28", label: "May 2025" },
        { start: "2025-05-28", end: "2025-06-28", label: "June 2025" },
        { start: "2025-06-28", end: "2025-07-28", label: "July 2025" },
        { start: "2025-07-28", end: "2025-08-28", label: "August 2025" },
        { start: "2025-08-28", end: "2025-09-28", label: "September 2025" }
      ]
    },
    {
      paidOn: "2026-01-22",
      amount: 1000000,
      notes: "Covers Oct 2025 - Feb 2026",
      coveredMonths: ["2025-10", "2025-11", "2025-12", "2026-01", "2026-02"],
      coveredPeriods: [
        { start: "2025-09-28", end: "2025-10-28", label: "October 2025" },
        { start: "2025-10-28", end: "2025-11-28", label: "November 2025" },
        { start: "2025-11-28", end: "2025-12-28", label: "December 2025" },
        { start: "2025-12-28", end: "2026-01-28", label: "January 2026" },
        { start: "2026-01-28", end: "2026-02-28", label: "February 2026" }
      ]
    }
  ]
} as const
