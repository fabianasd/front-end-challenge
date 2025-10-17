<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { baseRoute } from '@/routes/students'
import { useStudentsStore } from '@/stores/students'
import { createStudent, updateStudent, getStudentByRa } from '@/api/studentsAPI'
import { matchesStudentRa, normalizeStudent } from '@/utils/student'
import StudentsNav from '@/components/students/StudentsNav.vue'
import AcademicLayout from '@/layouts/AcademicLayout.vue'

const route = useRoute()
const router = useRouter()
const store = useStudentsStore()

const routes = {
  list: baseRoute,
  create: `${baseRoute}/new`,
  edit: (ra: string) => `${baseRoute}/${encodeURIComponent(ra)}/edit`,
} as const

const isEdit = computed(() => !!route.params.ra)
const loading = ref(false)
const saving = ref(false)
const snackbar = reactive({ open: false, message: '' })

type FormModel = {
  ra: string
  fullName: string
  cpf: string
  email: string
}
const emptyForm: FormModel = { ra: '', fullName: '', cpf: '', email: '' }
const form = reactive<FormModel>({ ...emptyForm })

const errors = reactive<FormModel>({ ra: '', fullName: '', cpf: '', email: '' })

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

    const fromStore = store.items.find((s) => matchesStudentRa(s, ra))
    const raw = fromStore ?? (await getStudentByRa(ra))
    const data = normalizeStudent(raw)

    form.ra = data.ra ?? ''
    form.fullName = data.fullName ?? ''
    form.cpf = (data.cpf ?? '').replace(/\D/g, '')
    form.email = data.email ?? ''
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error ?? 'erro')
    snackbar.message = `Não foi possível carregar o aluno ${ra}: ${message}`
    snackbar.open = true
  } finally {
    loading.value = false
  }
}

async function onSave() {
  if (!validate()) return

  const raVal = form.ra.trim()
  const cpfVal = form.cpf.replace(/\D/g, '')

  if (!raVal) {
    snackbar.message = 'RA é obrigatório.'
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

    snackbar.open = true
    await store.fetchAll().catch(() => void 0)
    router.push(routes.list)
  } catch (error: unknown) {
    snackbar.message = error instanceof Error ? error.message : 'Falha ao salvar aluno'
    snackbar.open = true
  } finally {
    saving.value = false
  }
}

function onCancel() {
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

function validate() {
  errors.fullName = form.fullName.trim().length >= 3 ? '' : 'Informe o nome completo (mín. 3 caracteres)'
  errors.email = !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? '' : 'E-mail inválido'
  errors.ra = form.ra.trim() ? '' : 'Informe o RA'
  const cleanCpf = form.cpf.replace(/\D/g, '')
  errors.cpf = cleanCpf.length === 11 ? '' : 'CPF deve ter 11 dígitos'
  return !errors.fullName && !errors.email && !errors.ra && !errors.cpf
}
</script>

<template>
  <AcademicLayout title="+A Educação — Matrículas">
    <template #nav>
      <StudentsNav :routes="routes" :active="route.path.startsWith(baseRoute)"
        :current="isEdit ? route.path : routes.create" />
    </template>

    <v-breadcrumbs :items="[
      { title: 'Alunos', to: routes.list },
      { title: isEdit ? 'Editar aluno' : 'Cadastrar aluno', disabled: true },
    ]" divider=" / " class="breadcrumbs" />

    <v-card>
      <v-card-title>Dados Pessoais</v-card-title>

      <v-card-text class="form-grid">
        <v-form @submit.prevent="onSave">
          <v-row dense>
            <v-col cols="12">
              <v-text-field v-model="form.fullName" label="Nome completo" placeholder="João da Silva 3"
                variant="outlined" rounded="lg" :disabled="loading || saving" :error="!!errors.fullName"
                :error-messages="errors.fullName ? [errors.fullName] : []" />
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="form.email" type="email" label="E-mail" placeholder="joaoo3@email.com"
                variant="outlined" rounded="lg" :disabled="loading || saving" :error="!!errors.email"
                :error-messages="errors.email ? [errors.email] : []" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.ra" label="Registro Acadêmico (RA)" placeholder="123456789" variant="outlined"
                rounded="lg" :disabled="isEdit || loading || saving" :error="!!errors.ra"
                :error-messages="errors.ra ? [errors.ra] : []" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.cpf" label="CPF" placeholder="02434537014" variant="outlined" rounded="lg"
                maxlength="14" :disabled="isEdit || loading || saving" :error="!!errors.cpf"
                :error-messages="errors.cpf ? [errors.cpf] : []" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn class="btn-cancel" variant="flat" @click="onCancel" :disabled="saving">
          Cancelar
        </v-btn>
        <v-btn class="btn-save" @click="onSave" :loading="saving">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar.open" :timeout="3500">
      {{ snackbar.message }}
    </v-snackbar>
  </AcademicLayout>
</template>

<style scoped>
.form-grid {
  max-width: 1100px;
  margin-inline: auto;
}

.breadcrumbs {
  color: #3c4043;
  font-size: 20px;
  margin: 8px 0 16px;
  display: flex;
  align-items: baseline;
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 520px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #3c4043;
}

.field input {
  border: 1px solid #cfd8dc;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  background: #ffffff;
  transition: border-color 0.2s;
}

.field input:focus {
  outline: none;
  border-color: #1e88e5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.15);
}

.field small {
  color: #e53935;
  font-size: 12px;
}

.btn-cancel {
  background: #eceff1;
  color: #455a64;
  font-weight: 600;
}

.btn-cancel:hover {
  background: #cfd8dc;
}

.btn-save {
  background: #2e7d32;
  color: #fff;
  font-weight: 600;
  padding: 0 24px;
}

.btn-save:hover {
  background: #1b5e20;
}

@media (max-width: 600px) {
  .breadcrumbs {
    font-size: 18px;
  }
}
</style>
