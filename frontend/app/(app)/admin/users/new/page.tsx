'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import Link from 'next/link'

export default function NewUserPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      router.push('/admin/users')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setError(err?.response?.data?.message ?? 'Error al crear usuario')
    },
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    mutation.mutate({
      email: fd.get('email') as string,
      password: fd.get('password') as string,
      firstName: fd.get('firstName') as string,
      lastName: fd.get('lastName') as string,
      role: fd.get('role') as string,
    })
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link href="/admin/users" className="text-sm text-neutral-500 hover:text-neutral-700">
          ← Usuarios
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 mt-2">Nuevo usuario</h1>
      </div>

      <div className="card p-6">
        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-danger-100 px-4 py-3 text-sm text-danger-600">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" name="firstName" required placeholder="María" />
            <Input label="Apellido" name="lastName" required placeholder="García" />
          </div>
          <Input label="Correo electrónico" name="email" type="email" required
            placeholder="usuario@escuela.edu.mx" />
          <Input label="Contraseña inicial" name="password" type="password" required
            placeholder="Mín. 6 caracteres" />
          <Select label="Rol" name="role" required>
            <option value="TEACHER">Docente</option>
            <option value="STUDENT">Alumno</option>
            <option value="ADMIN">Administrador</option>
          </Select>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={mutation.isPending}>Crear usuario</Button>
            <Link href="/admin/users">
              <Button type="button" variant="secondary">Cancelar</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
