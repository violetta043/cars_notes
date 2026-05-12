interface Props {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="search-bar">
      <svg className="search-bar__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="8.5" cy="8.5" r="5.5" />
        <line x1="13" y1="13" x2="18" y2="18" />
      </svg>
      <input
        className="search-bar__input"
        type="search"
        placeholder="Поиск по модели, владельцу, телефону..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button className="search-bar__clear" onClick={() => onChange('')} aria-label="Очистить">
          ✕
        </button>
      )}
    </div>
  )
}
