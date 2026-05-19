import { useState } from 'react'
import type { Car } from '../types/car'

type CarFormData = Omit<Car, 'id'>

interface Props {
  initialData?: Car
  onSubmit: (data: CarFormData) => void
  onCancel: () => void
}

const currentYear = new Date().getFullYear()

function formatPhone(value: string): string {
  const trimmed = value.trimStart()

  if (trimmed.startsWith('+')) {
    const digits = trimmed.slice(1).replace(/\D/g, '').slice(0, 13)
    if (!digits) return '+'
    const ccLen = digits.length > 10 ? Math.min(3, digits.length - 10) : 1
    const cc = digits.slice(0, ccLen)
    const local = digits.slice(ccLen)
    const parts: string[] = ['+' + cc]
    if (local.length > 0) parts.push(local.slice(0, 3))
    if (local.length > 3) parts.push(local.slice(3, 6))
    if (local.length > 6) parts.push(local.slice(6, 8))
    if (local.length > 8) parts.push(local.slice(8, 10))
    return parts.join(' ')
  }

  const digits = trimmed.replace(/\D/g, '').slice(0, 10)
  const parts: string[] = []
  if (digits.length > 0) parts.push(digits.slice(0, 3))
  if (digits.length > 3) parts.push(digits.slice(3, 6))
  if (digits.length > 6) parts.push(digits.slice(6, 8))
  if (digits.length > 8) parts.push(digits.slice(8, 10))
  return parts.join(' ')
}

function formatPlate(value: string): string {
  const v = value.replace(/\s/g, '').toUpperCase()
  if (v.length <= 2) return v
  if (/\d/.test(v[2])) {
    const p1 = v.slice(0, 2)
    const p2 = v.slice(2, 6)
    const p3 = v.slice(6)
    return [p1, p2, p3].filter(Boolean).join(' ')
  }
  return v
}

function emptyForm(): CarFormData {
  return {
    model: '',
    plateNumber: '',
    year: currentYear,
    vin: '',
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
        <label className="form-label" htmlFor="model">Марка и модель</label>
        <input
          id="model"
          className="form-input"
          type="text"
          required
          placeholder="Toyota Camry"
          value={form.model}
          onChange={e => set('model', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="plateNumber">Гос. номер</label>
        <input
          id="plateNumber"
          className="form-input form-input--mono"
          type="text"
          required
          placeholder="АА 1234 АА"
          value={form.plateNumber}
          onChange={e => set('plateNumber', formatPlate(e.target.value))}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="year">Год выпуска</label>
          <input
            id="year"
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
          <label className="form-label" htmlFor="mileage">Пробег (км)</label>
          <input
            id="mileage"
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
        <label className="form-label" htmlFor="vin">VIN-код</label>
        <input
          id="vin"
          className="form-input form-input--mono"
          type="text"
          placeholder="17 символов"
          minLength={17}
          maxLength={17}
          value={form.vin}
          onChange={e => set('vin', e.target.value.toUpperCase())}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="ownerName">Владелец</label>
        <input
          id="ownerName"
          className="form-input"
          type="text"
          required
          placeholder="Иван Иванов"
          value={form.ownerName}
          onChange={e => set('ownerName', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="ownerPhone">Телефон клиента</label>
        <input
          id="ownerPhone"
          className="form-input"
          type="tel"
          required
          placeholder="+38 099 123 45 67"
          value={form.ownerPhone}
          onChange={e => set('ownerPhone', formatPhone(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="lastOilChange">Дата последней замены масла</label>
        <input
          id="lastOilChange"
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
          <label className="form-label" htmlFor="warrantyExpiry">Дата окончания гарантии</label>
          <input
            id="warrantyExpiry"
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
