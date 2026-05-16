// ─── Auth ────────────────────────────────────────────────────────────────────

export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT'

export interface UserDto {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  active: boolean
  createdAt: string
}

export interface LoginResponse {
  token: string
  type: string
  user: UserDto
}

// ─── Grupos ──────────────────────────────────────────────────────────────────

export interface GrupoDto {
  id: string
  name: string
  subject: string
  gradeLevel: string | null
  description: string | null
  teacher: UserDto
  studentCount: number
  active: boolean
  createdAt: string
}

export interface GrupoSummaryDto {
  id: string
  name: string
  subject: string
  gradeLevel: string | null
  teacherName: string
  studentCount: number
  averageScore: number | null
}

// ─── Assignments ─────────────────────────────────────────────────────────────

export type SubmissionType = 'TEXT' | 'FILE' | 'BOTH'
export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'LATE' | 'GRADED' | 'RETURNED'

export interface AssignmentDto {
  id: string
  grupoId: string
  grupoName: string
  title: string
  description: string | null
  dueDate: string | null
  maxPoints: number
  submissionType: SubmissionType
  published: boolean
  createdAt: string
  submissionStatus: SubmissionStatus | null
}

// ─── Submissions ─────────────────────────────────────────────────────────────

export interface GradeDto {
  id: string
  submissionId: string
  score: number
  maxPoints: number
  feedback: string | null
  graderName: string
  gradedAt: string
  updatedAt: string
}

export interface SubmissionDto {
  id: string
  assignmentId: string
  assignmentTitle: string
  student: UserDto
  textBody: string | null
  fileName: string | null
  fileSizeBytes: number | null
  submittedAt: string
  status: SubmissionStatus
  grade: GradeDto | null
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface StudentDashboardDto {
  grupos: GrupoSummaryDto[]
  pendingAssignments: AssignmentDto[]
  recentlySubmitted: AssignmentDto[]
}

// ─── API Errors ──────────────────────────────────────────────────────────────

export interface ApiError {
  status: number
  error: string
  message: string
  details?: string[]
  timestamp: string
}
