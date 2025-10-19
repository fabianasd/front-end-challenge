<script setup lang="ts">
import { computed } from 'vue'
import { baseRoute } from '@/router'
import StudentsNav from '@/components/students/StudentsNav.vue'
import AcademicLayout from '@/layouts/AcademicLayout.vue'
import { useStudentForm } from '@/composables/useStudentForm'

const {
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
} = useStudentForm()

const digitsOnly = (v: string) => v.replace(/\D/g, '')

const formatCpf = (v: string) => {
  const d = digitsOnly(v).slice(0, 11)
  const p1 = d.slice(0, 3)
  const p2 = d.slice(3, 6)
  const p3 = d.slice(6, 9)
  const p4 = d.slice(9, 11)
  return [p1, p2, p3].filter(Boolean).join('.') + (p4 ? `-${p4}` : '')
}

const cpfMasked = computed(() => formatCpf(form.cpf ?? ''))

function onCpfInput(val: string) {
  form.cpf = digitsOnly(val).slice(0, 11)
}
</script>

<template>
  <AcademicLayout>
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
        <v-form @submit.prevent="save">
          <v-row dense>
            <v-col cols="12">
              <v-text-field v-model="form.fullName" label="Nome completo" placeholder="Nome completo" variant="outlined"
                rounded="lg" :disabled="loading || saving" :error="!!errors.fullName"
                :error-messages="errors.fullName ? [errors.fullName] : []" />
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="form.email" type="email" label="E-mail" placeholder="E-mail" variant="outlined"
                rounded="lg" :disabled="loading || saving" :error="!!errors.email"
                :error-messages="errors.email ? [errors.email] : []" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.ra" label="Registro Acadêmico (RA)" placeholder="Registro Acadêmico (RA)"
                variant="outlined" rounded="lg" :disabled="isEdit || loading || saving" :error="!!errors.ra"
                :error-messages="errors.ra ? [errors.ra] : []" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field :model-value="cpfMasked" @update:modelValue="onCpfInput" label="CPF" placeholder="CPF"
                variant="outlined" rounded="lg" :disabled="isEdit || loading || saving" :error="!!errors.cpf"
                :error-messages="errors.cpf ? [errors.cpf] : []" maxlength="14" inputmode="numeric" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn class="btn-cancel" variant="flat" @click="cancel" :disabled="saving">
          Cancelar
        </v-btn>
        <v-btn class="btn-save" @click="save" :loading="saving">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar.open" :timeout="3500" :color="snackbar.color">
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
