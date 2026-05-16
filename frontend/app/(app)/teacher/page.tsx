'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { listMyGrupos } from '@/lib/api'
import { ListSkeleton } from '@/components/ui/Skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/auth'

export default function TeacherHomePage() {
  const { user } = useAuth()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['grupos', 'mine'],
    queryFn: listMyGrupos,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Buenos días, {user?.firstName} 👋
        </h1>
        <p className="text-neutral-500 text-sm mt-1">Tus grupos activos</p>
      </div>

      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : isError ? (
        <ErrorMessage onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState
          icon="📚"
          title="Sin grupos asignados"
          description="El administrador aún no te ha asignado ningún grupo."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map(grupo => (
            <Link
              key={grupo.id}
              href={`/teacher/grupos/${grupo.id}`}
              className="card p-5 hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="badge-neutral text-xs">{grupo.subject}</span>
                {grupo.gradeLevel && (
                  <span className="text-xs text-neutral-400">{grupo.gradeLevel}</span>
                )}
              </div>
              <h2 className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                {grupo.name}
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                👨‍🎓 {grupo.studentCount} alumnos
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
