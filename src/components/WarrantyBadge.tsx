import type { Car } from '../types/car'

interface Props {
  hasWarranty: Car['hasWarranty']
  warrantyExpiry: Car['warrantyExpiry']
}

export function WarrantyBadge({ hasWarranty, warrantyExpiry }: Props) {
  if (!hasWarranty) {
    return <span className="badge badge--grey">Без гарантии</span>
  }

  const expired = warrantyExpiry ? new Date(warrantyExpiry) < new Date() : false

  return expired
    ? <span className="badge badge--red">Гарантия истекла</span>
    : <span className="badge badge--green">Гарантия активна</span>
}
