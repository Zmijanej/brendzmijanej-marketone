const dollarFormatter = new Intl.NumberFormat('sq-AL', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatMoney(cents: number): string {
  return dollarFormatter.format(cents / 100)
}
