import http from './https';
import type { Student } from '@/types/Student';
import { toApiStudentCreate, toApiStudentUpdate } from '../utils/student';

function unwrap<T = any>(res: any): T {
  return (res && typeof res === 'object' && 'data' in res ? (res as any).data : res) as T
}

export async function listStudents(params?: { q?: string; page?: number; size?: number }) {
  const { data } = await http.get('/students', { params });
  const items = unwrap<Student[] | { items: Student[] }>(data);
  const arr = Array.isArray(items)
    ? items
    : (items as any)?.items && Array.isArray((items as any).items)
      ? (items as any).items
      : [];
  return arr as Student[];
}

export async function getStudentByRa(ra: string) {
  const { data } = await http.get(`/students/${encodeURIComponent(ra)}`);
  return unwrap<Student>(data);
}

export async function createStudent(input: { ra: string; cpf: string; fullName: string; email: string }) {
  const payload = toApiStudentCreate(input);
  const { data } = await http.post('/students', payload);
  return unwrap<Student>(data);
}

export async function updateStudent(ra: string, input: Omit<Student, 'ra' | 'cpf'>) {
  const payload = toApiStudentUpdate(input);
  const { data } = await http.put(`/students/${encodeURIComponent(ra)}`, payload);
  return unwrap<Student>(data);
}

export async function deleteStudent(ra: string) {
  await http.delete(`/students/${encodeURIComponent(ra)}`);
}
