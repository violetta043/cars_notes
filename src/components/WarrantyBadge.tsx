import type { Car } from '../types/car'

interface Props {
  hasWarranty: Car['hasWarranty']
  warrantyExpiry: Car['warrantyExpiry']
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2L4 6v5c0 4.42 3.45 8.57 8 9.59C16.55 19.57 20 15.42 20 11V6l-8-4z" />
    </svg>
  )
}

export function WarrantyBadge({ hasWarranty, warrantyExpiry }: Props) {
  if (!hasWarranty) {
    return (
      <span className="badge badge--grey">
        <ShieldIcon />
        Без гарантии
      </span>
    )
  }

  const expired = warrantyExpiry ? new Date(warrantyExpiry) < new Date() : false

  return expired ? (
    <span className="badge badge--red">
      <ShieldIcon />
      Гарантия истекла
    </span>
  ) : (
    <span className="badge badge--green">
      <ShieldIcon />
      Гарантия активна
    </span>
  )
}
