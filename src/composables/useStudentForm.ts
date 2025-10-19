import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { studentRoutePaths } from '@/routes/students'
import { useStudentsStore } from '@/stores/students'
import { createStudent, getStudentByRa, updateStudent } from '@/api/studentsAPI'
import { matchesStudentRa, normalizeStudent } from '@/utils/student'

type FormModel = {
  ra: string
  fullName: string
  cpf: string
  email: string
}

type SnackbarState = {
  open: boolean
  message: string
  color: 'success' | 'error' | 'info'
}

const emptyForm: FormModel = { ra: '', fullName: '', cpf: '', email: '' }

export function useStudentForm() {
  const route = useRoute()
  const router = useRouter()
  const store = useStudentsStore()

  const routes = studentRoutePaths
  const isEdit = computed(() => !!route.params.ra)
  const loading = ref(false)
  const saving = ref(false)
  const snackbar = reactive<SnackbarState>({ open: false, message: '', color: 'info' })

  const form = reactive<FormModel>({ ...emptyForm })
  const errors = reactive<FormModel>({ ...emptyForm })

  function resetForm() {
    Object.assign(form, emptyForm)
    Object.assign(errors, emptyForm)
  }

  async function loadIfEdit() {
    const raParam = (route.params.ra ?? route.params.id) as string | undefined
    if (!raParam) return

    const ra = String(raParam)
    loading.value = true
    try {
      if (!store.items?.length) {
        await store.fetchAll().catch(() => void 0)
      }

      const fromStore = store.items.find((student) => matchesStudentRa(student, ra))
      const raw = fromStore ?? (await getStudentByRa(ra))
      const data = normalizeStudent(raw)

      form.ra = data.ra ?? ''
      form.fullName = data.fullName ?? ''
      form.cpf = (data.cpf ?? '').replace(/\D/g, '')
      form.email = data.email ?? ''
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error ?? 'erro')
      snackbar.message = `Não foi possível carregar o aluno ${ra}: ${message}`
      snackbar.color = 'error'
      snackbar.open = true
    } finally {
      loading.value = false
    }
  }

  function validate() {
    errors.fullName = form.fullName.trim().length >= 3 ? '' : 'Informe o nome completo (mín. 3 caracteres)'
    errors.email = !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? '' : 'E-mail inválido'
    errors.ra = form.ra.trim() ? '' : 'Informe o RA'
    const cleanCpf = form.cpf.replace(/\D/g, '')
    errors.cpf = cleanCpf.length === 11 ? '' : 'CPF deve ter 11 dígitos'
    return !errors.fullName && !errors.email && !errors.ra && !errors.cpf
  }

  async function save() {
    if (!validate()) return

    const raVal = form.ra.trim()
    const cpfVal = form.cpf.replace(/\D/g, '')
    if (!raVal) {
      snackbar.message = 'RA é obrigatório.'
      snackbar.color = 'error'
      snackbar.open = true
      return
    }

    saving.value = true
    try {
      if (isEdit.value) {
        const originalRa = String(route.params.ra ?? route.params.id)
        await updateStudent(originalRa, {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
        })
        snackbar.message = `Aluno ${originalRa} atualizado com sucesso.`
      } else {
        await createStudent({
          ra: raVal,
          cpf: cpfVal,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
        })
        snackbar.message = `Aluno ${raVal} cadastrado com sucesso.`
      }

      snackbar.color = 'success'
      snackbar.open = true
      await store.fetchAll().catch(() => void 0)
      router.push(routes.list)
    } catch (error: unknown) {
      snackbar.message = error instanceof Error ? error.message : 'Falha ao salvar aluno'
      snackbar.color = 'error'
      snackbar.open = true
    } finally {
      saving.value = false
    }
  }

  function cancel() {
    router.push(routes.list)
  }

  watch(
    () => route.fullPath,
    () => {
      resetForm()
      if (isEdit.value) void loadIfEdit()
    },
    { immediate: true },
  )

  return {
    route,
    routes,
    form,
    errors,
    loading,
    saving,
    snackbar,
    isEdit,
    save,
    cancel,
  }
}
