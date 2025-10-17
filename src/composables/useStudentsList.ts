import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useStudentsStore } from '@/stores/students'
import { deleteStudent } from '@/api/studentsAPI'
import type { Student } from '@/types/Student'
import { normalizeStudent } from '@/utils/student'

type Params = { baseRoute: string }

export function useStudentsList({ baseRoute }: Params) {
  const store = useStudentsStore()
  const loading = computed(() => store.loading)
  const rows = computed<Student[]>(() => store.items)
  const alunosOpen = ref(true)
  const q = ref('')

  const headers = [
    { title: 'Registro Acadêmico', value: 'ra' },
    { title: 'Nome', value: 'fullName' },
    { title: 'CPF', value: 'cpf' },
    { title: 'Ações', value: 'actions', sortable: false, align: 'light' as const },
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
    { title: 'Alunos', disabled: false, to: baseRoute },
    { title: 'Lista de alunos', disabled: true },
  ])

  const del = reactive({ open: false, ra: '' })

  function confirmDelete(ra: string) {
    del.ra = ra
    del.open = true
  }

  async function doDelete() {
    if (!del.ra) return
    await deleteStudent(del.ra)
    del.open = false
    await store.fetchAll()
  }

  function rowFromSlot(item: unknown): Student {
    const raw = (item as { raw?: Student })?.raw
    return raw ?? (item as Student)
  }

  function applySearch() {
    q.value = q.value.trim()
  }

  function init(route: RouteLocationNormalizedLoaded) {
    watch(
      () => route.path,
      (p) => { if (p.startsWith(baseRoute)) alunosOpen.value = true },
      { immediate: true },
    )
    onMounted(() => { void store.fetchAll() })
  }

  return {
    loading,
    headers,
    q,
    filteredRows,
    breadcrumbs,
    del,
    confirmDelete,
    doDelete,
    rowFromSlot,
    alunosOpen,
    applySearch,
    init,
  }
}
