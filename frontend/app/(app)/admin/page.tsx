'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { listUsers, listAllGrupos } from '@/lib/api'
import { ListSkeleton } from '@/components/ui/Skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Button } from '@/components/ui/Button'

export default function AdminHomePage() {
  const usersQ = useQuery({ queryKey: ['admin', 'users'], queryFn: () => listUsers() })
  const gruposQ = useQuery({ queryKey: ['admin', 'grupos'], queryFn: listAllGrupos })

  const teachers = usersQ.data?.filter(u => u.role === 'TEACHER').length ?? 0
  const students = usersQ.data?.filter(u => u.role === 'STUDENT').length ?? 0
  const grupos = gruposQ.data?.length ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Panel de administración</h1>
        <p className="text-neutral-500 text-sm mt-1">Resumen de la institución</p>
      </div>

      {usersQ.isLoading ? (
        <ListSkeleton rows={1} />
      ) : usersQ.isError ? (
        <ErrorMessage onRetry={usersQ.refetch} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Docentes', value: teachers, href: '/admin/users?role=TEACHER', icon: '👩‍🏫' },
            { label: 'Alumnos', value: students, href: '/admin/users?role=STUDENT', icon: '👨‍🎓' },
            { label: 'Grupos activos', value: grupos, href: '/admin/grupos', icon: '📚' },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="card p-6 hover:border-primary-300 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                  <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
                </div>
                <span className="text-3xl" aria-hidden>{stat.icon}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/users/new">
          <Button>+ Nuevo usuario</Button>
        </Link>
        <Link href="/admin/grupos/new">
          <Button variant="secondary">+ Nuevo grupo</Button>
        </Link>
      </div>
    </div>
  )
}
