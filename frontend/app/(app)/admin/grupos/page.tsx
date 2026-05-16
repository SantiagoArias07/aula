'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { listAllGrupos } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { ListSkeleton } from '@/components/ui/Skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import { fullName } from '@/lib/utils'

export default function AdminGruposPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'grupos'],
    queryFn: listAllGrupos,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Grupos</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {data ? `${data.length} grupos` : '—'}
          </p>
        </div>
        <Link href="/admin/grupos/new">
          <Button>+ Nuevo grupo</Button>
        </Link>
      </div>

      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : isError ? (
        <ErrorMessage onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState
          icon="📚"
          title="Sin grupos"
          description="Crea el primer grupo para asignar docentes y alumnos."
          action={<Link href="/admin/grupos/new"><Button>+ Crear grupo</Button></Link>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map(grupo => (
            <div key={grupo.id} className="card p-5 space-y-3">
              <div>
                <h2 className="font-semibold text-neutral-900">{grupo.name}</h2>
                <p className="text-sm text-neutral-500">{grupo.subject}</p>
                {grupo.gradeLevel && (
                  <span className="badge-neutral mt-1">{grupo.gradeLevel}</span>
                )}
              </div>
              <div className="text-sm text-neutral-600 space-y-1">
                <p>👩‍🏫 {fullName(grupo.teacher)}</p>
                <p>👨‍🎓 {grupo.studentCount} alumnos</p>
              </div>
              <div className="flex gap-2 pt-1">
                <Link href={`/admin/grupos/${grupo.id}/enroll`}>
                  <Button variant="secondary" size="sm">Inscribir alumnos</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
