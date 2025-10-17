<script setup lang="ts">
import { baseRoute } from '@/routes/students'
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
        <v-form @submit.prevent="save">
          <v-row dense>
            <v-col cols="12">
              <v-text-field v-model="form.fullName" label="Nome completo" placeholder="Nome completo"
                variant="outlined" rounded="lg" :disabled="loading || saving" :error="!!errors.fullName"
                :error-messages="errors.fullName ? [errors.fullName] : []" />
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="form.email" type="email" label="E-mail" placeholder="E-mail"
                variant="outlined" rounded="lg" :disabled="loading || saving" :error="!!errors.email"
                :error-messages="errors.email ? [errors.email] : []" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.ra" label="Registro Acadêmico (RA)" placeholder="Registro Acadêmico (RA)" variant="outlined"
                rounded="lg" :disabled="isEdit || loading || saving" :error="!!errors.ra"
                :error-messages="errors.ra ? [errors.ra] : []" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.cpf" label="CPF" placeholder="CPF" variant="outlined" rounded="lg"
                maxlength="14" :disabled="isEdit || loading || saving" :error="!!errors.cpf"
                :error-messages="errors.cpf ? [errors.cpf] : []" />
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
