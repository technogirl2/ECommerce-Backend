export interface SnackTypeOption {
  value: string
  label: string
}

export const SNACK_TYPE_OPTIONS: SnackTypeOption[] = [
  { value: 'COOKIES_PASTRIES', label: 'Cookies & Pastries' },
  { value: 'CANDIES_CHOCOLATES', label: 'Candies & Chocolates' },
  { value: 'JELLY_DRIED_FRUIT', label: 'Jelly & Dried Fruit' },
  { value: 'CHIPS', label: 'Chips' },
  { value: 'CRACKERS', label: 'Crackers' },
  { value: 'NUTS', label: 'Nuts' },
  { value: 'BEVERAGES', label: 'Beverages' },
  { value: 'POWDERED_BREWED_DRINKS', label: 'Powdered & Brewed Drinks' },
]

export function getSnackTypeLabel(value: string): string {
  return SNACK_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value
}
