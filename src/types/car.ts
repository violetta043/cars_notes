export interface Car {
  id: string
  model: string
  year: number
  vin: string
  ownerName: string
  ownerPhone: string
  mileage: number
  lastOilChange: string | null
  hasWarranty: boolean
  warrantyExpiry: string | null
}
