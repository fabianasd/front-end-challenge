import type { Student } from '@/types/Student'

type StudentLike = Partial<Student> & {
  name?: string
  full_name?: string
  CPF?: string
  document?: string
}

export function normalizeStudent(raw: StudentLike): Student {
  return {
    ra: String(raw.ra ?? ''),
    fullName: raw.fullName ?? raw.name ?? raw.full_name ?? '',
    cpf: raw.cpf ?? raw.CPF ?? raw.document ?? '',
    email: raw.email ?? '',
  }
}

export function matchesStudentRa(raw: StudentLike, ra: string): boolean {
  return String(raw.ra ?? '') === ra
}

// Payload mappers (client -> API)
export type ApiStudentCreate = { ra: string; cpf: string; name: string; email: string }
export type ApiStudentUpdate = { name?: string; email?: string }

export function toApiStudentCreate(input: { ra: string; cpf: string; fullName: string; email: string }): ApiStudentCreate {
  return {
    ra: String(input.ra),
    cpf: input.cpf,
    name: input.fullName,
    email: input.email,
  }
}

export function toApiStudentUpdate(input: Omit<Student, 'ra' | 'cpf'>): ApiStudentUpdate {
  const out: ApiStudentUpdate = {}
  if (typeof input.fullName === 'string') out.name = input.fullName
  if (typeof input.email === 'string') out.email = input.email
  return out
}
