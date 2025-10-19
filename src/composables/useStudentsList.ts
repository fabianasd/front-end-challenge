import { computed, onMounted, reactive, ref } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { deleteStudent } from '@/api/studentsAPI'
import type { Student } from '@/types/Student'
import { normalizeStudent } from '@/utils/student'
import { studentRoutePaths } from '@/router'

type Feedback = {
  open: boolean
  message: string
  color: 'success' | 'error'
}

export function useStudentsList() {
  const store = useStudentsStore()
  const loading = computed(() => store.loading)
  const rows = computed<Student[]>(() => store.items)
  const q = ref('')
  const deleting = ref(false)
  const feedback = reactive<Feedback>({ open: false, message: '', color: 'success' })

  const headers = [
    { title: 'Registro Acadêmico', value: 'ra' },
    { title: 'Nome', value: 'fullName' },
    { title: 'CPF', value: 'cpf' },
    { title: 'Ações', value: 'actions', sortable: false },
  ]

  const normalizedRows = computed<Student[]>(() =>
    rows.value.map((r) => normalizeStudent(r)),
  )

  const filteredRows = computed<Student[]>(() => {
    const term = q.value.trim().toLowerCase()
    if (!term) return normalizedRows.value
    return normalizedRows.value.filter((r) =>
      String(r.ra).toLowerCase().includes(term) ||
      r.fullName.toLowerCase().includes(term) ||
      r.cpf.toLowerCase().includes(term),
    )
  })

  const breadcrumbs = computed(() => [
    { title: 'Alunos', disabled: false, to: studentRoutePaths.list },
    { title: 'Lista de alunos', disabled: true },
  ])

  const del = reactive({ open: false, ra: '' })

  function confirmDelete(ra: string) {
    del.ra = ra
    del.open = true
  }

  async function doDelete() {
    if (!del.ra || deleting.value) return
    deleting.value = true
    const ra = del.ra
    try {
      await deleteStudent(ra)
      store.removeByRa(ra)
      feedback.message = `Aluno ${ra} removido com sucesso.`
      feedback.color = 'success'
      feedback.open = true
      del.open = false
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Falha ao excluir aluno'
      feedback.message = message
      feedback.color = 'error'
      feedback.open = true
    } finally {
      deleting.value = false
      del.ra = ''
    }
  }

  function rowFromSlot(item: unknown): Student {
    const raw = (item as { raw?: Student })?.raw
    return raw ?? (item as Student)
  }

  function applySearch() {
    q.value = q.value.trim()
  }

  function init() {
    onMounted(() => {
      if (!store.items.length) {
        void store.fetchAll()
      }
    })
  }

  return {
    loading,
    headers,
    q,
    filteredRows,
    breadcrumbs,
    del,
    deleting,
    confirmDelete,
    doDelete,
    rowFromSlot,
    applySearch,
    feedback,
    init,
  }
}
