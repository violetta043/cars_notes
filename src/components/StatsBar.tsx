import type { Car } from '../types/car'

const OIL_THRESHOLD_MS = 180 * 24 * 60 * 60 * 1000
const MONTH_MS = 30 * 24 * 60 * 60 * 1000

interface Props {
  cars: Car[]
}

export function StatsBar({ cars }: Props) {
  const today = new Date()

  const activeWarranties = cars.filter(car => {
    if (!car.hasWarranty) return false
    if (!car.warrantyExpiry) return true
    return new Date(car.warrantyExpiry) >= today
  }).length

  const oilChangeSoon = cars.filter(car =>
    !car.lastOilChange ||
    today.getTime() - new Date(car.lastOilChange).getTime() > OIL_THRESHOLD_MS
  ).length

  const newThisMonth = cars.filter(car =>
    car.createdAt && today.getTime() - new Date(car.createdAt).getTime() <= MONTH_MS
  ).length

  return (
    <div className="stats-bar">
      <div className="stat-tile">
        <span className="stat-tile__value">{cars.length}</span>
        <span className="stat-tile__label">Всего авто</span>
        {newThisMonth > 0 && (
          <span className="stat-tile__sub stat-tile__sub--green">
            +{newThisMonth} за месяц
          </span>
        )}
      </div>
      <div className="stat-tile">
        <span className="stat-tile__value stat-tile__value--green">{activeWarranties}</span>
        <span className="stat-tile__label">гарантий</span>
        <span className="stat-tile__sub stat-tile__sub--green">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2L4 6v5c0 4.42 3.45 8.57 8 9.59C16.55 19.57 20 15.42 20 11V6l-8-4z" />
          </svg>
          активных
        </span>
      </div>
      <div className="stat-tile">
        <span className="stat-tile__value stat-tile__value--amber">{oilChangeSoon}</span>
        <span className="stat-tile__label">Замена масла</span>
        <span className="stat-tile__sub stat-tile__sub--amber">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
          скоро
        </span>
      </div>
    </div>
  )
}
