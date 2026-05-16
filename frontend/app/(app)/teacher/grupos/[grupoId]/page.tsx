'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { use } from 'react'
import { getGrupo, listAssignments } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { ListSkeleton } from '@/components/ui/Skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDateTime, submissionStatusLabel } from '@/lib/utils'

interface PageProps {
  params: Promise<{ grupoId: string }>
}

export default function TeacherGrupoPage({ params }: PageProps) {
  const { grupoId } = use(params)

  const grupoQ = useQuery({ queryKey: ['grupos', grupoId], queryFn: () => getGrupo(grupoId) })
  const assignQ = useQuery({
    queryKey: ['assignments', grupoId],
    queryFn: () => listAssignments(grupoId),
  })

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link href="/teacher" className="text-sm text-neutral-500 hover:text-neutral-700">
        ← Mis grupos
      </Link>

      {grupoQ.isLoading ? (
        <ListSkeleton rows={1} />
      ) : grupoQ.isError ? (
        <ErrorMessage />
      ) : grupoQ.data ? (
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="badge-neutral text-xs">{grupoQ.data.subject}</span>
              <h1 className="text-2xl font-bold text-neutral-900 mt-1">{grupoQ.data.name}</h1>
              <p className="text-neutral-500 text-sm">
                👨‍🎓 {grupoQ.data.studentCount} alumnos
                {grupoQ.data.gradeLevel && ` · ${grupoQ.data.gradeLevel}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/teacher/grupos/${grupoId}/students`}>
                <Button variant="secondary" size="sm">Ver alumnos</Button>
              </Link>
              <Link href={`/teacher/grupos/${grupoId}/assignments/new`}>
                <Button size="sm">+ Tarea</Button>
              </Link>
            </div>
          </div>
          {grupoQ.data.description && (
            <p className="text-sm text-neutral-600 mt-3 max-w-2xl">{grupoQ.data.description}</p>
          )}
        </div>
      ) : null}

      {/* Assignments */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Tareas</h2>
        {assignQ.isLoading ? (
          <ListSkeleton rows={3} />
        ) : assignQ.isError ? (
          <ErrorMessage onRetry={assignQ.refetch} />
        ) : !assignQ.data?.length ? (
          <EmptyState
            icon="📝"
            title="Sin tareas"
            description="Crea la primera tarea para este grupo."
            action={
              <Link href={`/teacher/grupos/${grupoId}/assignments/new`}>
                <Button>+ Nueva tarea</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {assignQ.data.map(a => (
              <Link
                key={a.id}
                href={`/teacher/grupos/${grupoId}/assignments/${a.id}`}
                className="card p-4 flex items-center justify-between gap-4 hover:border-primary-300 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="font-medium text-neutral-900 group-hover:text-primary-700">
                    {a.title}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {a.dueDate ? `Entrega: ${formatDateTime(a.dueDate)}` : 'Sin fecha límite'}
                    {' · '}{a.maxPoints} pts
                  </p>
                </div>
                <span className={a.published ? 'badge-success' : 'badge-neutral'}>
                  {a.published ? 'Publicada' : 'Borrador'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
