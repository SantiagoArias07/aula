'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getStudentDashboard } from '@/lib/api'
import { ListSkeleton } from '@/components/ui/Skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/auth'
import {
  formatDateTime, isOverdue, isDueSoon,
  submissionStatusLabel, submissionStatusColor,
} from '@/lib/utils'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['student', 'dashboard'],
    queryFn: getStudentDashboard,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Hola, {user?.firstName} 👋
        </h1>
        <p className="text-neutral-500 text-sm mt-1">Tu resumen de hoy</p>
      </div>

      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : isError ? (
        <ErrorMessage onRetry={refetch} />
      ) : data ? (
        <>
          {/* Grupos */}
          <section aria-labelledby="grupos-heading">
            <h2 id="grupos-heading" className="text-lg font-semibold text-neutral-800 mb-3">
              Mis grupos
            </h2>
            {!data.grupos.length ? (
              <EmptyState icon="📚" title="Sin grupos" description="Aún no estás inscrito en ningún grupo." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.grupos.map(g => (
                  <Link
                    key={g.id}
                    href={`/student/grupos/${g.id}`}
                    className="card p-4 hover:border-primary-300 transition-colors group"
                  >
                    <p className="text-xs text-neutral-400 mb-1">{g.subject}</p>
                    <p className="font-semibold text-neutral-900 group-hover:text-primary-700">
                      {g.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">Prof. {g.teacherName}</p>
                    {g.averageScore !== null && (
                      <p className="text-sm font-bold text-primary-700 mt-2">
                        Promedio: {g.averageScore.toFixed(1)}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Tareas pendientes */}
          <section aria-labelledby="pending-heading">
            <h2 id="pending-heading" className="text-lg font-semibold text-neutral-800 mb-3">
              Tareas pendientes
            </h2>
            {!data.pendingAssignments.length ? (
              <EmptyState icon="✅" title="¡Al día!" description="No tienes tareas pendientes." />
            ) : (
              <div className="space-y-2">
                {data.pendingAssignments.map(a => {
                  const over = isOverdue(a.dueDate)
                  const soon = !over && isDueSoon(a.dueDate)
                  return (
                    <Link
                      key={a.id}
                      href={`/student/grupos/${a.grupoId}/assignments/${a.id}`}
                      className="card px-4 py-3 flex items-center justify-between gap-4 hover:border-primary-300 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-900 truncate">{a.title}</p>
                        <p className="text-xs text-neutral-500">{a.grupoName}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {a.dueDate && (
                          <p className={`text-xs font-medium ${over ? 'text-danger-600' : soon ? 'text-warning-600' : 'text-neutral-500'}`}>
                            {over ? '⚠ Vencida' : soon ? '⏰ Próxima' : formatDateTime(a.dueDate)}
                          </p>
                        )}
                        <p className="text-xs text-neutral-400 mt-0.5">{a.maxPoints} pts</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>

          {/* Entregas recientes */}
          {data.recentlySubmitted.length > 0 && (
            <section aria-labelledby="recent-heading">
              <h2 id="recent-heading" className="text-lg font-semibold text-neutral-800 mb-3">
                Entregas recientes
              </h2>
              <div className="space-y-2">
                {data.recentlySubmitted.map(a => (
                  <Link
                    key={a.id}
                    href={`/student/grupos/${a.grupoId}/assignments/${a.id}`}
                    className="card px-4 py-3 flex items-center justify-between gap-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-neutral-900 truncate">{a.title}</p>
                      <p className="text-xs text-neutral-500">{a.grupoName}</p>
                    </div>
                    <span className={submissionStatusColor(a.submissionStatus)}>
                      {submissionStatusLabel(a.submissionStatus)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      ) : null}
    </div>
  )
}
