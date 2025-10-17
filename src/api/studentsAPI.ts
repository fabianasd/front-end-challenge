import { http } from './https'
import type { Student } from '../types/Student'

export async function listStudents() {
  const { data } = await http.get<Student[]>('/users')
  return data
}
export async function getStudentByRa(ra: string) {
  const { data } = await http.get<Student>(`/users/${ra}`)
  return data
}
export async function createStudent(payload: Omit<Student, 'ra'|'cpf'> & { ra: string; cpf: string }) {
  const { data } = await http.post<Student>('/users', payload)
  return data
}
export async function updateStudent(ra: string, payload: Omit<Student, 'ra'|'cpf'>) {
  const { data } = await http.put<Student>(`/users/${ra}`, payload)
  return data
}
export async function deleteStudent(ra: string) {
  await http.delete(`/users/${ra}`)
}
