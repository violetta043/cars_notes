import type { Car } from '../types/car'
import { CarCard } from './CarCard'

interface Props {
  cars: Car[]
  onEdit: (car: Car) => void
  onDelete: (id: string) => void
}

export function CarList({ cars, onEdit, onDelete }: Props) {
  if (cars.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">Нет записей</p>
        <p className="empty-state__sub">Нажмите «+ Добавить», чтобы внести первый автомобиль</p>
      </div>
    )
  }

  return (
    <ul className="car-list">
      {cars.map(car => (
        <li key={car.id}>
          <CarCard car={car} onEdit={onEdit} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  )
}
