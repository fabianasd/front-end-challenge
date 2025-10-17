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
