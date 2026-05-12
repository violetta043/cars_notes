import type { Car } from '../types/car'
import { CarCard } from './CarCard'

interface Props {
  cars: Car[]
  totalCount: number
  onEdit: (car: Car) => void
  onDelete: (id: string) => void
}

export function CarList({ cars, totalCount, onEdit, onDelete }: Props) {
  if (totalCount === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">Нет записей</p>
        <p className="empty-state__sub">Нажмите «+ Добавить», чтобы внести первый автомобиль</p>
      </div>
    )
  }

  if (cars.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">Ничего не найдено</p>
        <p className="empty-state__sub">Попробуйте изменить параметры поиска или фильтры</p>
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
