'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAssignment, getMySubmission, submitAssignment, attachFile } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { ListSkeleton } from '@/components/ui/Skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { formatDateTime, isOverdue } from '@/lib/utils'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ grupoId: string; assignmentId: string }>
}

export default function StudentAssignmentPage({ params }: PageProps) {
  const { grupoId, assignmentId } = use(params)
  const qc = useQueryClient()
  const [textBody, setTextBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const assignQ = useQuery({
    queryKey: ['assignment', grupoId, assignmentId],
    queryFn: () => getAssignment(grupoId, assignmentId),
  })

  const submissionQ = useQuery({
    queryKey: ['my-submission', assignmentId],
    queryFn: () => getMySubmission(assignmentId),
    retry: false,
  })

  const submitMut = useMutation({
    mutationFn: async () => {
      const sub = await submitAssignment(assignmentId, textBody || undefined)
      if (file) await attachFile(assignmentId, file)
      return sub
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-submission', assignmentId] })
      qc.invalidateQueries({ queryKey: ['student', 'dashboard'] })
    },
    onError: (e: { response?: { data?: { message?: string } } }) => {
      setSubmitError(e?.response?.data?.message ?? 'Error al entregar')
    },
  })

  const a = assignQ.data
  const sub = submissionQ.data
  const alreadySubmitted = !!sub
  const overdue = isOverdue(a?.dueDate ?? null)

  return (
    <div className="max-w-2xl space-y-6">
      <Link href={`/student/grupos/${grupoId}`}
        className="text-sm text-neutral-500 hover:text-neutral-700">
        ← Regresar al grupo
      </Link>

      {assignQ.isLoading ? (
        <ListSkeleton rows={2} />
      ) : assignQ.isError ? (
        <ErrorMessage />
      ) : a ? (
        <>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{a.title}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm">
              <span className="text-neutral-500">
                {a.dueDate
                  ? <span className={overdue ? 'text-danger-600 font-medium' : ''}>
                      {overdue ? '⚠ Venció: ' : 'Entrega: '}{formatDateTime(a.dueDate)}
                    </span>
                  : 'Sin fecha límite'}
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-500">{a.maxPoints} puntos</span>
            </div>
          </div>

          {a.description && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-neutral-700 mb-2">Instrucciones</h2>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap">{a.description}</p>
            </div>
          )}

          {/* Grade display */}
          {sub?.grade && (
            <div className="card p-5 border-success-600/30">
              <h2 className="text-sm font-semibold text-neutral-700 mb-2">Tu calificación</h2>
              <p className="text-3xl font-bold text-success-600">
                {sub.grade.score}
                <span className="text-lg text-neutral-400">/{sub.grade.maxPoints}</span>
              </p>
              {sub.grade.feedback && (
                <div className="mt-3 p-3 rounded-lg bg-neutral-50 text-sm text-neutral-700">
                  <p className="font-medium text-neutral-600 mb-1">Retroalimentación:</p>
                  <p className="whitespace-pre-wrap">{sub.grade.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Submission status / form */}
          {alreadySubmitted && !sub?.grade ? (
            <div className="card p-5">
              <div className="flex items-center gap-2 text-success-600">
                <span aria-hidden>✅</span>
                <p className="font-medium">Tarea entregada</p>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Entregada el {formatDateTime(sub.submittedAt)}
              </p>
              {sub.textBody && (
                <div className="mt-3 p-3 rounded-lg bg-neutral-50 text-sm text-neutral-700 whitespace-pre-wrap">
                  {sub.textBody}
                </div>
              )}
              {sub.fileName && (
                <p className="mt-2 text-xs text-neutral-500">📎 {sub.fileName}</p>
              )}
            </div>
          ) : !alreadySubmitted ? (
            <div className="card p-6 space-y-4">
              <h2 className="text-base font-semibold text-neutral-800">Entregar tarea</h2>

              {submitError && (
                <div role="alert" className="rounded-lg bg-danger-100 px-4 py-3 text-sm text-danger-600">
                  {submitError}
                </div>
              )}

              {(a.submissionType === 'TEXT' || a.submissionType === 'BOTH') && (
                <Textarea
                  label="Tu respuesta"
                  value={textBody}
                  onChange={e => setTextBody(e.target.value)}
                  rows={6}
                  placeholder="Escribe tu respuesta aquí…"
                />
              )}

              {(a.submissionType === 'FILE' || a.submissionType === 'BOTH') && (
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Archivo adjunto
                    {a.submissionType === 'FILE' && (
                      <span className="text-danger-600 ml-0.5" aria-hidden>*</span>
                    )}
                  </label>
                  <input
                    type="file"
                    onChange={e => setFile(e.target.files?.[0] ?? null)}
                    className="mt-1 block w-full text-sm text-neutral-600
                      file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                      file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700
                      hover:file:bg-primary-100"
                  />
                </div>
              )}

              <Button
                loading={submitMut.isPending}
                onClick={() => {
                  setSubmitError(null)
                  submitMut.mutate()
                }}
                className="w-full sm:w-auto"
              >
                Entregar tarea
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
