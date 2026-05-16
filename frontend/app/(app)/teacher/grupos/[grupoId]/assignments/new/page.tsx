'use client'

import { type FormEvent, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAssignment } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import Link from 'next/link'

interface PageProps { params: Promise<{ grupoId: string }> }

export default function NewAssignmentPage({ params }: PageProps) {
  const { grupoId } = use(params)
  const router = useRouter()
  const qc = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (body: Parameters<typeof createAssignment>[1]) =>
      createAssignment(grupoId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assignments', grupoId] })
      router.push(`/teacher/grupos/${grupoId}`)
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setError(err?.response?.data?.message ?? 'Error al crear la tarea')
    },
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    const dueDateRaw = fd.get('dueDate') as string
    mutation.mutate({
      title: fd.get('title') as string,
      description: (fd.get('description') as string) || undefined,
      dueDate: dueDateRaw ? new Date(dueDateRaw).toISOString() : undefined,
      maxPoints: Number(fd.get('maxPoints')),
      submissionType: fd.get('submissionType') as string,
      published: fd.get('published') === 'true',
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href={`/teacher/grupos/${grupoId}`}
          className="text-sm text-neutral-500 hover:text-neutral-700">
          ← Regresar al grupo
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 mt-2">Nueva tarea</h1>
      </div>

      <div className="card p-6">
        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-danger-100 px-4 py-3 text-sm text-danger-600">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input label="Título" name="title" required placeholder="Ej. Práctica 1 — Fracciones" />
          <Textarea label="Instrucciones" name="description" rows={5}
            placeholder="Describe qué deben hacer los alumnos…" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Fecha límite" name="dueDate" type="datetime-local" />
            <Input label="Puntaje máximo" name="maxPoints" type="number"
              defaultValue="100" min="0" max="1000" required />
          </div>
          <Select label="Tipo de entrega" name="submissionType" required>
            <option value="BOTH">Texto y archivo</option>
            <option value="TEXT">Solo texto</option>
            <option value="FILE">Solo archivo</option>
          </Select>
          <Select label="Estado" name="published" required>
            <option value="false">Guardar como borrador</option>
            <option value="true">Publicar ahora</option>
          </Select>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={mutation.isPending}>Guardar tarea</Button>
            <Link href={`/teacher/grupos/${grupoId}`}>
              <Button type="button" variant="secondary">Cancelar</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
