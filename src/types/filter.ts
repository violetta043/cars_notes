export interface FilterState {
  search: string
  warranty: 'all' | 'active' | 'expired' | 'none'
  yearFrom: string
  yearTo: string
}

export function defaultFilter(): FilterState {
  return { search: '', warranty: 'all', yearFrom: '', yearTo: '' }
}

export function hasActiveFilters(f: FilterState): boolean {
  return f.search !== '' || f.warranty !== 'all' || f.yearFrom !== '' || f.yearTo !== ''
}
