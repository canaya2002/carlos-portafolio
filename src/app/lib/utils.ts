import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilidad para formatear fechas
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Utilidad para scroll suave a elementos
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Utilidad para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Utilidad para debounce (útil para búsquedas)
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Utilidad para throttle (útil para scroll events)
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Utilidad para copiar texto al clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Error copying to clipboard:', err)
    return false
  }
}

// Utilidad para detectar dispositivo móvil
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

// Utilidad para generar IDs únicos
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Utilidad para formatear números
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-MX').format(num)
}

// Utilidad para formatear moneda
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Utilidad para calcular tiempo de lectura
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Utilidad para detectar modo oscuro del sistema
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Utilidad para guardar en localStorage de forma segura
export function safeLocalStorage() {
  return {
    getItem: (key: string): string | null => {
      try {
        return typeof window !== 'undefined' ? localStorage.getItem(key) : null
      } catch {
        return null
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, value)
        }
      } catch {
        // Silent fail
      }
    },
    removeItem: (key: string): void => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(key)
        }
      } catch {
        // Silent fail
      }
    }
  }
}

// Tipos personalizados
export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

export interface Experience {
  id: string
  company: string
  position: string
  duration: string
  description: string[]
  technologies: string[]
  logo?: string
}

export interface Skill {
  name: string
  level: number
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'tools' | 'ai'
}

// Constantes útiles
export const SOCIAL_LINKS = {
  email: 'carlosaremployment@hotmail.com',
  phone: '+52 55 4416 7974',
  github: 'https://github.com/CArlos12002',
  linkedin: '#', // Agregar URL real
  website: 'https://carloscurriculum.com.mx'
} as const

export const NAVIGATION_ITEMS = [
  { id: 'hero', label: 'Inicio' },
  { id: 'about', label: 'Sobre Mí' },
  { id: 'experience', label: 'Experiencia' },
  { id: 'skills', label: 'Habilidades' },
  { id: 'projects', label: 'Proyectos' },
  { id: 'education', label: 'Formación' },
  { id: 'contact', label: 'Contacto' }
] as const