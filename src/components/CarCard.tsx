import type { Car } from '../types/car'
import { WarrantyBadge } from './WarrantyBadge'

interface Props {
  car: Car
  onEdit: (car: Car) => void
  onDelete: (id: string) => void
}

function fmtDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ru-RU')
}

export function CarCard({ car, onEdit, onDelete }: Props) {
  return (
    <article className="car-card">
      <div className="car-card__header">
        <div>
          <h2 className="car-card__title">{car.model}</h2>
          <div className="car-card__meta">
            {car.plateNumber && <span className="car-card__plate">{car.plateNumber}</span>}
            <span className="car-card__year">{car.year} г.</span>
          </div>
        </div>
        <WarrantyBadge hasWarranty={car.hasWarranty} warrantyExpiry={car.warrantyExpiry} />
      </div>

      <div className="car-card__body">
        <div className="car-card__row">
          <span className="car-card__label">Владелец</span>
          <span>{car.ownerName}</span>
        </div>
        <div className="car-card__row">
          <span className="car-card__label">Телефон</span>
          <a href={`tel:${car.ownerPhone}`} className="car-card__phone">{car.ownerPhone}</a>
        </div>
        <div className="car-card__row">
          <span className="car-card__label">Пробег</span>
          <span>{car.mileage.toLocaleString('ru-RU')} км</span>
        </div>
        {car.vin && (
          <div className="car-card__row">
            <span className="car-card__label">VIN</span>
            <span className="car-card__vin">{car.vin}</span>
          </div>
        )}
        <div className="car-card__row">
          <span className="car-card__label">Замена масла</span>
          <span>{fmtDate(car.lastOilChange)}</span>
        </div>
        {car.hasWarranty && car.warrantyExpiry && (
          <div className="car-card__row">
            <span className="car-card__label">Гарантия до</span>
            <span>{fmtDate(car.warrantyExpiry)}</span>
          </div>
        )}
      </div>

      <div className="car-card__footer">
        <button className="btn btn--ghost" onClick={() => onEdit(car)}>
          Редактировать
        </button>
        <button className="btn btn--danger" onClick={() => onDelete(car.id)}>
          Удалить
        </button>
      </div>
    </article>
  )
}
