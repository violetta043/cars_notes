import { useState, useMemo, useRef } from 'react'
import { CarList } from './components/CarList'
import { CarForm } from './components/CarForm'
import { SearchBar } from './components/SearchBar'
import { FilterPanel } from './components/FilterPanel'
import { StatsBar } from './components/StatsBar'
import { useCars } from './hooks/useCars'
import type { Car } from './types/car'
import { defaultFilter, hasActiveFilters } from './types/filter'
import type { FilterState } from './types/filter'
import './App.css'

export default function App() {
  const { cars, addCar, updateCar, deleteCar, importCars } = useCars()
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  function handleExport() {
    const blob = new Blob([JSON.stringify(cars, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cars-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        if (!Array.isArray(data) || !data.every(item => typeof item.id === 'string')) {
          throw new Error()
        }
        if (cars.length > 0 && !window.confirm(`Заменить ${cars.length} текущих записей данными из файла?`)) return
        importCars(data as Car[])
      } catch {
        alert('Не удалось прочитать файл. Убедитесь, что это корректный экспорт из этого приложения.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand__icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.92c.04-.3.07-.6.07-.58 0-.28-.03-.58-.07-.88l1.9-1.47c.17-.13.21-.38.1-.57l-1.8-3.12c-.11-.2-.35-.27-.56-.2l-2.24.9c-.47-.36-.97-.66-1.52-.88l-.34-2.38c-.04-.23-.23-.4-.47-.4h-3.6c-.24 0-.43.17-.47.4l-.34 2.38c-.55.22-1.05.52-1.52.88l-2.24-.9c-.21-.07-.45 0-.56.2L3.46 9.58c-.11.19-.07.44.1.57l1.9 1.47c-.04.3-.07.61-.07.88s.03.58.07.88l-1.9 1.47c-.17.13-.21.38-.1.57l1.8 3.12c.11.2.35.27.56.2l2.24-.9c.47.36.97.66 1.52.88l.34 2.38c.04.23.23.4.47.4h3.6c.24 0 .43-.17.47-.4l.34-2.38c.55-.22 1.05-.52 1.52-.88l2.24.9c.21.07.45 0 .56-.2l1.8-3.12c.11-.2.07-.44-.1-.57l-1.9-1.47z"/>
            </svg>
          </div>
          <div>
            <h1 className="app-title">AutoService</h1>
            <p className="app-subtitle">Учёт автомобилей</p>
          </div>
        </div>
        <div className="header-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <button className="btn btn--ghost" onClick={() => fileInputRef.current?.click()}>
            Импорт
          </button>
          <button className="btn btn--ghost" onClick={handleExport} disabled={cars.length === 0}>
            Экспорт
          </button>
          <button className="btn btn--primary" onClick={openAdd}>+ Добавить</button>
        </div>
      </header>

      <StatsBar cars={cars} />

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
