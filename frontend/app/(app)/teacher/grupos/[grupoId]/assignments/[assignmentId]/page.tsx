'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAssignment, listSubmissions, gradeSubmission, updateGrade } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { ListSkeleton } from '@/components/ui/Skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDateTime, submissionStatusLabel, submissionStatusColor, fullName } from '@/lib/utils'
import Link from 'next/link'
import type { SubmissionDto } from '@/types'

interface PageProps {
  params: Promise<{ grupoId: string; assignmentId: string }>
}

function GradeForm({
  submission,
  maxPoints,
  onDone,
}: {
  submission: SubmissionDto
  maxPoints: number
  onDone: () => void
}) {
  const qc = useQueryClient()
  const [score, setScore] = useState(submission.grade?.score?.toString() ?? '')
  const [feedback, setFeedback] = useState(submission.grade?.feedback ?? '')
  const [err, setErr] = useState<string | null>(null)
  const hasGrade = !!submission.grade

  const mutation = useMutation({
    mutationFn: () =>
      hasGrade
        ? updateGrade(submission.id, Number(score), feedback || undefined)
        : gradeSubmission(submission.id, Number(score), feedback || undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['submissions', submission.assignmentId] })
      onDone()
    },
    onError: (e: { response?: { data?: { message?: string } } }) => {
      setErr(e?.response?.data?.message ?? 'Error al calificar')
    },
  })

  return (
    <div className="border-t border-neutral-100 pt-4 mt-4 space-y-3">
      {err && <p className="text-xs text-danger-600" role="alert">{err}</p>}
      <div className="flex gap-3">
        <div className="w-28">
          <Input
            label={`Calificación / ${maxPoints}`}
            type="number"
            min="0"
            max={maxPoints}
            value={score}
            onChange={e => setScore(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Textarea
            label="Retroalimentación (opcional)"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            rows={2}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" loading={mutation.isPending} onClick={() => mutation.mutate()}>
          {hasGrade ? 'Actualizar calificación' : 'Calificar'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onDone}>Cancelar</Button>
      </div>
    </div>
  )
}

export default function TeacherAssignmentPage({ params }: PageProps) {
  const { grupoId, assignmentId } = use(params)
  const [gradingId, setGradingId] = useState<string | null>(null)

  const assignQ = useQuery({
    queryKey: ['assignment', grupoId, assignmentId],
    queryFn: () => getAssignment(grupoId, assignmentId),
  })

  const submissionsQ = useQuery({
    queryKey: ['submissions', assignmentId],
    queryFn: () => listSubmissions(assignmentId),
  })

  return (
    <div className="space-y-6">
      <Link href={`/teacher/grupos/${grupoId}`}
        className="text-sm text-neutral-500 hover:text-neutral-700">
        ← Regresar al grupo
      </Link>

      {assignQ.data && (
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{assignQ.data.title}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {assignQ.data.dueDate ? `Entrega: ${formatDateTime(assignQ.data.dueDate)}` : 'Sin fecha límite'}
            {' · '}{assignQ.data.maxPoints} pts
          </p>
          {assignQ.data.description && (
            <p className="text-sm text-neutral-700 mt-3 max-w-2xl">{assignQ.data.description}</p>
          )}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Entregas {submissionsQ.data ? `(${submissionsQ.data.length})` : ''}
        </h2>

        {submissionsQ.isLoading ? (
          <ListSkeleton rows={3} />
        ) : submissionsQ.isError ? (
          <ErrorMessage onRetry={submissionsQ.refetch} />
        ) : !submissionsQ.data?.length ? (
          <EmptyState icon="📭" title="Sin entregas" description="Aún no hay entregas de alumnos." />
        ) : (
          <div className="space-y-4">
            {submissionsQ.data.map(sub => (
              <div key={sub.id} className="card p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-medium text-neutral-900">{fullName(sub.student)}</p>
                    <p className="text-xs text-neutral-500">{formatDateTime(sub.submittedAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {sub.grade && (
                      <span className="text-sm font-semibold text-neutral-800">
                        {sub.grade.score}/{assignQ.data?.maxPoints}
                      </span>
                    )}
                    <span className={submissionStatusColor(sub.status)}>
                      {submissionStatusLabel(sub.status)}
                    </span>
                  </div>
                </div>

                {sub.textBody && (
                  <div className="mt-3 p-3 rounded-lg bg-neutral-50 text-sm text-neutral-700 whitespace-pre-wrap">
                    {sub.textBody}
                  </div>
                )}
                {sub.fileName && (
                  <p className="mt-2 text-xs text-neutral-500">📎 {sub.fileName}</p>
                )}

                {gradingId === sub.id ? (
                  <GradeForm
                    submission={sub}
                    maxPoints={assignQ.data?.maxPoints ?? 100}
                    onDone={() => setGradingId(null)}
                  />
                ) : (
                  <button
                    onClick={() => setGradingId(sub.id)}
                    className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {sub.grade ? 'Editar calificación' : 'Calificar'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
