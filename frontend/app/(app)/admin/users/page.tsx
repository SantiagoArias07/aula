'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { listUsers } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { ListSkeleton } from '@/components/ui/Skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import { roleLabel } from '@/lib/utils'
import type { Role } from '@/types'

const ROLES: { value: string; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'TEACHER', label: 'Docentes' },
  { value: 'STUDENT', label: 'Alumnos' },
]

export default function AdminUsersPage() {
  const searchParams = useSearchParams()
  const roleFilter = (searchParams.get('role') ?? '') as Role | ''

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'users', roleFilter],
    queryFn: () => listUsers(roleFilter || undefined),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Usuarios</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {data ? `${data.length} usuarios` : '—'}
          </p>
        </div>
        <Link href="/admin/users/new">
          <Button>+ Nuevo usuario</Button>
        </Link>
      </div>

      {/* Role filter tabs */}
      <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Filtrar por rol">
        {ROLES.map(r => (
          <Link
            key={r.value}
            href={r.value ? `/admin/users?role=${r.value}` : '/admin/users'}
            role="tab"
            aria-selected={roleFilter === r.value}
            className={[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              roleFilter === r.value
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50',
            ].join(' ')}
          >
            {r.label}
          </Link>
        ))}
      </div>

      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : isError ? (
        <ErrorMessage onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState
          icon="👤"
          title="Sin usuarios"
          description="Crea el primer usuario para comenzar."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Correo</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Rol</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {data.map(user => (
                  <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="badge-neutral">{roleLabel(user.role)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={user.active ? 'badge-success' : 'badge-danger'}>
                        {user.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
