import type { SubmissionStatus } from '@/types'

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function isDueSoon(iso: string | null): boolean {
  if (!iso) return false
  const due = new Date(iso)
  const now = new Date()
  const diff = due.getTime() - now.getTime()
  return diff > 0 && diff < 48 * 60 * 60 * 1000
}

export function isOverdue(iso: string | null): boolean {
  if (!iso) return false
  return new Date(iso) < new Date()
}

export function submissionStatusLabel(status: SubmissionStatus | null): string {
  switch (status) {
    case 'SUBMITTED': return 'Entregada'
    case 'LATE':      return 'Entrega tardía'
    case 'GRADED':    return 'Calificada'
    case 'RETURNED':  return 'Devuelta'
    case 'DRAFT':     return 'Borrador'
    default:          return 'Pendiente'
  }
}

export function submissionStatusColor(status: SubmissionStatus | null): string {
  switch (status) {
    case 'SUBMITTED':
    case 'RETURNED': return 'badge-neutral'
    case 'LATE':     return 'badge-warning'
    case 'GRADED':   return 'badge-success'
    case 'DRAFT':    return 'badge-neutral'
    default:         return 'badge-danger'
  }
}

export function roleLabel(role: string): string {
  switch (role) {
    case 'ADMIN':   return 'Administrador'
    case 'TEACHER': return 'Docente'
    case 'STUDENT': return 'Alumno'
    default: return role
  }
}

export function fullName(u: { firstName: string; lastName: string }): string {
  return `${u.firstName} ${u.lastName}`
}
