import { useState } from 'react'
import { CarList } from './components/CarList'
import { CarForm } from './components/CarForm'
import { useCars } from './hooks/useCars'
import type { Car } from './types/car'
import './App.css'

export default function App() {
  const { cars, addCar, updateCar, deleteCar } = useCars()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Car | null>(null)

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

      <CarList cars={cars} onEdit={openEdit} onDelete={handleDelete} />

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
