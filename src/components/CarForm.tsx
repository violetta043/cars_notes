import { useState } from 'react'
import type { Car } from '../types/car'

type CarFormData = Omit<Car, 'id'>

interface Props {
  initialData?: Car
  onSubmit: (data: CarFormData) => void
  onCancel: () => void
}

const currentYear = new Date().getFullYear()

function emptyForm(): CarFormData {
  return {
    model: '',
    year: currentYear,
    ownerName: '',
    ownerPhone: '',
    mileage: 0,
    lastOilChange: null,
    hasWarranty: false,
    warrantyExpiry: null,
  }
}

export function CarForm({ initialData, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<CarFormData>(
    initialData ? { ...initialData } : emptyForm()
  )

  function set<K extends keyof CarFormData>(key: K, value: CarFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      ...form,
      warrantyExpiry: form.hasWarranty ? form.warrantyExpiry : null,
    })
  }

  return (
    <form className="car-form" onSubmit={handleSubmit} noValidate={false}>

      <div className="form-group">
        <label className="form-label">Марка и модель</label>
        <input
          className="form-input"
          type="text"
          required
          placeholder="Toyota Camry"
          value={form.model}
          onChange={e => set('model', e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Год выпуска</label>
          <input
            className="form-input"
            type="number"
            required
            min={1900}
            max={currentYear}
            value={form.year}
            onChange={e => set('year', Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Пробег (км)</label>
          <input
            className="form-input"
            type="number"
            required
            min={0}
            value={form.mileage}
            onChange={e => set('mileage', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Владелец</label>
        <input
          className="form-input"
          type="text"
          required
          placeholder="Иван Иванов"
          value={form.ownerName}
          onChange={e => set('ownerName', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Телефон клиента</label>
        <input
          className="form-input"
          type="tel"
          required
          placeholder="+38 099 123 45 67"
          value={form.ownerPhone}
          onChange={e => set('ownerPhone', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Дата последней замены масла</label>
        <input
          className="form-input"
          type="date"
          value={form.lastOilChange ?? ''}
          onChange={e => set('lastOilChange', e.target.value || null)}
        />
      </div>

      <label className="form-label form-label--checkbox">
        <input
          type="checkbox"
          checked={form.hasWarranty}
          onChange={e => set('hasWarranty', e.target.checked)}
        />
        Есть гарантия после обслуживания
      </label>

      {form.hasWarranty && (
        <div className="form-group">
          <label className="form-label">Дата окончания гарантии</label>
          <input
            className="form-input"
            type="date"
            required
            value={form.warrantyExpiry ?? ''}
            onChange={e => set('warrantyExpiry', e.target.value || null)}
          />
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="btn btn--primary">
          {initialData ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  )
}
