'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createGrupo, listUsers } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import Link from 'next/link'
import { fullName } from '@/lib/utils'

export default function NewGrupoPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const teachersQ = useQuery({
    queryKey: ['admin', 'users', 'TEACHER'],
    queryFn: () => listUsers('TEACHER'),
  })

  const mutation = useMutation({
    mutationFn: createGrupo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'grupos'] })
      router.push('/admin/grupos')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setError(err?.response?.data?.message ?? 'Error al crear grupo')
    },
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    mutation.mutate({
      name: fd.get('name') as string,
      subject: fd.get('subject') as string,
      gradeLevel: (fd.get('gradeLevel') as string) || undefined,
      description: (fd.get('description') as string) || undefined,
      teacherId: fd.get('teacherId') as string,
    })
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link href="/admin/grupos" className="text-sm text-neutral-500 hover:text-neutral-700">
          ← Grupos
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 mt-2">Nuevo grupo</h1>
      </div>

      <div className="card p-6">
        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-danger-100 px-4 py-3 text-sm text-danger-600">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input label="Nombre del grupo" name="name" required placeholder="3°A — Turno Matutino" />
          <Input label="Materia" name="subject" required placeholder="Matemáticas" />
          <Input label="Grado / Semestre" name="gradeLevel" placeholder="3° de secundaria" />
          <Select
            label="Docente asignado"
            name="teacherId"
            required
            disabled={teachersQ.isLoading}
          >
            <option value="">Selecciona un docente…</option>
            {teachersQ.data?.map(t => (
              <option key={t.id} value={t.id}>{fullName(t)} — {t.email}</option>
            ))}
          </Select>
          <Textarea label="Descripción (opcional)" name="description"
            placeholder="Descripción del grupo o materia…" />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={mutation.isPending}>Crear grupo</Button>
            <Link href="/admin/grupos">
              <Button type="button" variant="secondary">Cancelar</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
