export interface Car {
  id: string
  createdAt?: string
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
