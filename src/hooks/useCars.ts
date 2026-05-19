import { useLocalStorage } from './useLocalStorage'
import type { Car } from '../types/car'

export function useCars() {
  const [cars, setCars] = useLocalStorage<Car[]>('cars', [])

  const addCar = (data: Omit<Car, 'id'>) => {
    const car: Car = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setCars(prev => [...prev, car])
  }

  const updateCar = (id: string, data: Omit<Car, 'id'>) => {
    setCars(prev => prev.map(c => (c.id === id ? { ...data, id } : c)))
  }

  const deleteCar = (id: string) => {
    setCars(prev => prev.filter(c => c.id !== id))
  }

  const importCars = (data: Car[]) => {
    setCars(data)
  }

  return { cars, addCar, updateCar, deleteCar, importCars }
}
