'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getGrupo, listAssignments } from '@/lib/api'
import { ListSkeleton } from '@/components/ui/Skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  formatDateTime, isOverdue, isDueSoon,
  submissionStatusLabel, submissionStatusColor,
} from '@/lib/utils'

interface PageProps { params: Promise<{ grupoId: string }> }

export default function StudentGrupoPage({ params }: PageProps) {
  const { grupoId } = use(params)

  const grupoQ = useQuery({ queryKey: ['grupos', grupoId], queryFn: () => getGrupo(grupoId) })
  const assignQ = useQuery({
    queryKey: ['assignments', grupoId],
    queryFn: () => listAssignments(grupoId),
  })

  return (
    <div className="space-y-6">
      <Link href="/student" className="text-sm text-neutral-500 hover:text-neutral-700">
        ← Mi panel
      </Link>

      {grupoQ.data && (
        <div>
          <span className="badge-neutral text-xs">{grupoQ.data.subject}</span>
          <h1 className="text-2xl font-bold text-neutral-900 mt-1">{grupoQ.data.name}</h1>
          <p className="text-sm text-neutral-500">
            Prof. {grupoQ.data.teacher.firstName} {grupoQ.data.teacher.lastName}
          </p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Tareas</h2>
        {assignQ.isLoading ? (
          <ListSkeleton rows={3} />
        ) : assignQ.isError ? (
          <ErrorMessage onRetry={assignQ.refetch} />
        ) : !assignQ.data?.length ? (
          <EmptyState icon="📝" title="Sin tareas" description="El docente aún no ha publicado tareas." />
        ) : (
          <div className="space-y-3">
            {assignQ.data.map(a => {
              const over = isOverdue(a.dueDate)
              const soon = !over && isDueSoon(a.dueDate)
              return (
                <Link
                  key={a.id}
                  href={`/student/grupos/${grupoId}/assignments/${a.id}`}
                  className="card p-4 flex items-center justify-between gap-4 hover:border-primary-300 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-900">{a.title}</p>
                    <p className={`text-xs mt-0.5 ${over ? 'text-danger-600' : soon ? 'text-warning-600' : 'text-neutral-500'}`}>
                      {a.dueDate
                        ? `${over ? '⚠ Venció' : soon ? '⏰' : ''} ${formatDateTime(a.dueDate)}`
                        : 'Sin fecha límite'}
                      {' · '}{a.maxPoints} pts
                    </p>
                  </div>
                  <span className={submissionStatusColor(a.submissionStatus)}>
                    {submissionStatusLabel(a.submissionStatus)}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
