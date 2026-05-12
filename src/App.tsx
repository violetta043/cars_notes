import { useState, useMemo } from 'react'
import { CarList } from './components/CarList'
import { CarForm } from './components/CarForm'
import { SearchBar } from './components/SearchBar'
import { FilterPanel } from './components/FilterPanel'
import { useCars } from './hooks/useCars'
import type { Car } from './types/car'
import { defaultFilter, hasActiveFilters } from './types/filter'
import type { FilterState } from './types/filter'
import './App.css'

export default function App() {
  const { cars, addCar, updateCar, deleteCar } = useCars()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Car | null>(null)
  const [filter, setFilter] = useState<FilterState>(defaultFilter())

  const filteredCars = useMemo(() => {
    const today = new Date()
    return cars.filter(car => {
      if (filter.search) {
        const q = filter.search.toLowerCase()
        const match =
          car.model.toLowerCase().includes(q) ||
          car.ownerName.toLowerCase().includes(q) ||
          car.ownerPhone.includes(q)
        if (!match) return false
      }

      if (filter.warranty !== 'all') {
        const expired = car.warrantyExpiry ? new Date(car.warrantyExpiry) < today : false
        if (filter.warranty === 'none' && car.hasWarranty) return false
        if (filter.warranty === 'active' && (!car.hasWarranty || expired)) return false
        if (filter.warranty === 'expired' && (!car.hasWarranty || !expired)) return false
      }

      if (filter.yearFrom && car.year < Number(filter.yearFrom)) return false
      if (filter.yearTo && car.year > Number(filter.yearTo)) return false

      return true
    })
  }, [cars, filter])

  function openAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(car: Car) {
    setEditing(car)
    setModalOpen(true)
  }

  function close() {
    setModalOpen(false)
    setEditing(null)
  }

  function handleSubmit(data: Omit<Car, 'id'>) {
    if (editing) {
      updateCar(editing.id, data)
    } else {
      addCar(data)
    }
    close()
  }

  function handleDelete(id: string) {
    if (window.confirm('Удалить запись об этом автомобиле?')) {
      deleteCar(id)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Автомобили клиентов</h1>
        <button className="btn btn--primary" onClick={openAdd}>+ Добавить</button>
      </header>

      <div className="toolbar">
        <SearchBar value={filter.search} onChange={search => setFilter(f => ({ ...f, search }))} />
        <FilterPanel filter={filter} onChange={setFilter} />
      </div>

      {hasActiveFilters(filter) && cars.length > 0 && (
        <p className="results-count">
          Найдено: {filteredCars.length} из {cars.length}
        </p>
      )}

      <CarList
        cars={filteredCars}
        totalCount={cars.length}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) close() }}
        >
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal__header">
              <h2>{editing ? 'Редактировать запись' : 'Новый автомобиль'}</h2>
              <button className="modal__close" onClick={close} aria-label="Закрыть">✕</button>
            </div>
            <CarForm
              initialData={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={close}
            />
          </div>
        </div>
      )}
    </div>
  )
}
