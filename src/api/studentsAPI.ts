import { http } from './https'
import type { Student } from '../types/Student'
import { toApiStudentCreate, toApiStudentUpdate } from '../utils/student'

export async function listStudents() {
  const { data } = await http.get<Student[]>('/students')
  return data
}
export async function getStudentByRa(ra: string) {
  const { data } = await http.get<Student>(`/students/${ra}`)
  return data
}
export async function createStudent(payload: Omit<Student, 'ra'|'cpf'> & { ra: string; cpf: string }) {
  const { data } = await http.post<Student>('/students', toApiStudentCreate(payload))
  return data
}
export async function updateStudent(ra: string, payload: Omit<Student, 'ra'|'cpf'>) {
  const { data } = await http.put<Student>(`/students/${ra}`, toApiStudentUpdate(payload))
  return data
}
export async function deleteStudent(ra: string) {
  await http.delete(`/students/${ra}`)
}
