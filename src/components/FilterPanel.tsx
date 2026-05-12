import type { FilterState } from '../types/filter'
import { hasActiveFilters, defaultFilter } from '../types/filter'

interface Props {
  filter: FilterState
  onChange: (filter: FilterState) => void
}

export function FilterPanel({ filter, onChange }: Props) {
  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filter, [key]: value })
  }

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label className="filter-label">Гарантия</label>
        <select
          className="filter-select"
          value={filter.warranty}
          onChange={e => set('warranty', e.target.value as FilterState['warranty'])}
        >
          <option value="all">Все</option>
          <option value="active">Активна</option>
          <option value="expired">Истекла</option>
          <option value="none">Без гарантии</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Год выпуска</label>
        <div className="filter-year">
          <input
            className="filter-input"
            type="number"
            placeholder="от"
            min={1900}
            max={new Date().getFullYear()}
            value={filter.yearFrom}
            onChange={e => set('yearFrom', e.target.value)}
          />
          <span className="filter-year__sep">—</span>
          <input
            className="filter-input"
            type="number"
            placeholder="до"
            min={1900}
            max={new Date().getFullYear()}
            value={filter.yearTo}
            onChange={e => set('yearTo', e.target.value)}
          />
        </div>
      </div>

      {hasActiveFilters(filter) && (
        <button className="btn btn--ghost filter-reset" onClick={() => onChange(defaultFilter())}>
          Сбросить
        </button>
      )}
    </div>
  )
}
