import axios, { type AxiosError } from 'axios'
import type {
  LoginResponse,
  GrupoDto,
  AssignmentDto,
  SubmissionDto,
  GradeDto,
  StudentDashboardDto,
  UserDto,
  ApiError,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

function extractMessage(err: AxiosError<ApiError>): string {
  return err.response?.data?.message ?? 'Ocurrió un error. Inténtalo de nuevo.'
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/api/auth/login', { email, password })
  return data
}

// ─── Admin: Users ─────────────────────────────────────────────────────────────

export async function createUser(body: {
  email: string; password: string; firstName: string; lastName: string; role: string
}): Promise<UserDto> {
  const { data } = await apiClient.post<UserDto>('/api/admin/users', body)
  return data
}

export async function listUsers(role?: string): Promise<UserDto[]> {
  const { data } = await apiClient.get<UserDto[]>('/api/admin/users', {
    params: role ? { role } : undefined,
  })
  return data
}

export async function getUser(id: string): Promise<UserDto> {
  const { data } = await apiClient.get<UserDto>(`/api/admin/users/${id}`)
  return data
}

// ─── Admin: Grupos ────────────────────────────────────────────────────────────

export async function createGrupo(body: {
  name: string; subject: string; gradeLevel?: string; description?: string; teacherId: string
}): Promise<GrupoDto> {
  const { data } = await apiClient.post<GrupoDto>('/api/admin/grupos', body)
  return data
}

export async function listAllGrupos(): Promise<GrupoDto[]> {
  const { data } = await apiClient.get<GrupoDto[]>('/api/admin/grupos')
  return data
}

export async function enrollStudents(grupoId: string, studentIds: string[]): Promise<void> {
  await apiClient.post(`/api/admin/grupos/${grupoId}/enroll`, { studentIds })
}

// ─── Grupos ───────────────────────────────────────────────────────────────────

export async function listMyGrupos(): Promise<GrupoDto[]> {
  const { data } = await apiClient.get<GrupoDto[]>('/api/grupos')
  return data
}

export async function getGrupo(id: string): Promise<GrupoDto> {
  const { data } = await apiClient.get<GrupoDto>(`/api/grupos/${id}`)
  return data
}

export async function getStudentsInGrupo(grupoId: string): Promise<UserDto[]> {
  const { data } = await apiClient.get<UserDto[]>(`/api/grupos/${grupoId}/students`)
  return data
}

// ─── Assignments ──────────────────────────────────────────────────────────────

export async function createAssignment(
  grupoId: string,
  body: {
    title: string; description?: string; dueDate?: string
    maxPoints: number; submissionType: string; published: boolean
  }
): Promise<AssignmentDto> {
  const { data } = await apiClient.post<AssignmentDto>(
    `/api/grupos/${grupoId}/assignments`, body)
  return data
}

export async function listAssignments(grupoId: string): Promise<AssignmentDto[]> {
  const { data } = await apiClient.get<AssignmentDto[]>(`/api/grupos/${grupoId}/assignments`)
  return data
}

export async function getAssignment(grupoId: string, assignmentId: string): Promise<AssignmentDto> {
  const { data } = await apiClient.get<AssignmentDto>(
    `/api/grupos/${grupoId}/assignments/${assignmentId}`)
  return data
}

export async function updateAssignment(
  grupoId: string, assignmentId: string,
  body: {
    title: string; description?: string; dueDate?: string
    maxPoints: number; submissionType: string; published: boolean
  }
): Promise<AssignmentDto> {
  const { data } = await apiClient.put<AssignmentDto>(
    `/api/grupos/${grupoId}/assignments/${assignmentId}`, body)
  return data
}

export async function deleteAssignment(grupoId: string, assignmentId: string): Promise<void> {
  await apiClient.delete(`/api/grupos/${grupoId}/assignments/${assignmentId}`)
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export async function submitAssignment(
  assignmentId: string, textBody?: string
): Promise<SubmissionDto> {
  const { data } = await apiClient.post<SubmissionDto>(
    `/api/assignments/${assignmentId}/submit`, { textBody })
  return data
}

export async function attachFile(assignmentId: string, file: File): Promise<SubmissionDto> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.post<SubmissionDto>(
    `/api/assignments/${assignmentId}/submit/file`, form,
    { headers: { 'Content-Type': 'multipart/form-data' } })
  return data
}

export async function getMySubmission(assignmentId: string): Promise<SubmissionDto> {
  const { data } = await apiClient.get<SubmissionDto>(
    `/api/assignments/${assignmentId}/my-submission`)
  return data
}

export async function listSubmissions(assignmentId: string): Promise<SubmissionDto[]> {
  const { data } = await apiClient.get<SubmissionDto[]>(
    `/api/assignments/${assignmentId}/submissions`)
  return data
}

export async function getSubmission(submissionId: string): Promise<SubmissionDto> {
  const { data } = await apiClient.get<SubmissionDto>(`/api/submissions/${submissionId}`)
  return data
}

// ─── Grades ───────────────────────────────────────────────────────────────────

export async function gradeSubmission(
  submissionId: string, score: number, feedback?: string
): Promise<GradeDto> {
  const { data } = await apiClient.post<GradeDto>(
    `/api/submissions/${submissionId}/grade`, { score, feedback })
  return data
}

export async function updateGrade(
  submissionId: string, score: number, feedback?: string
): Promise<GradeDto> {
  const { data } = await apiClient.put<GradeDto>(
    `/api/submissions/${submissionId}/grade`, { score, feedback })
  return data
}

export async function getGrade(submissionId: string): Promise<GradeDto> {
  const { data } = await apiClient.get<GradeDto>(`/api/submissions/${submissionId}/grade`)
  return data
}

export async function getMyGradesForGrupo(grupoId: string): Promise<GradeDto[]> {
  const { data } = await apiClient.get<GradeDto[]>(`/api/student/grupos/${grupoId}/grades`)
  return data
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getStudentDashboard(): Promise<StudentDashboardDto> {
  const { data } = await apiClient.get<StudentDashboardDto>('/api/student/dashboard')
  return data
}
