<script setup lang="ts">
import { useRoute } from 'vue-router'
import AcademicLayout from '@/layouts/AcademicLayout.vue'
import StudentsNav from '@/components/students/StudentsNav.vue'
import ConfirmDeleteDialog from '@/components/students/ConfirmDeleteDialog.vue'
import { useStudentsList } from '@/composables/useStudentsList'
import { baseRoute, studentRoutePaths } from '@/router'

const routes = studentRoutePaths
const itemActionsSlot = 'item.actions' as const

const route = useRoute()

const digitsOnly = (v: string) => v?.replace(/\D/g, '') ?? ''

const formatCpf = (v: string) => {
  const d = digitsOnly(v).slice(0, 11)
  const p1 = d.slice(0, 3)
  const p2 = d.slice(3, 6)
  const p3 = d.slice(6, 9)
  const p4 = d.slice(9, 11)
  return [p1, p2, p3].filter(Boolean).join('.') + (p4 ? `-${p4}` : '')
}

const {
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
} = useStudentsList()

init()
</script>

<template>
  <AcademicLayout>
    <template #nav>
      <StudentsNav :routes="routes" :active="route.path.startsWith(baseRoute)" :current="route.path" />
    </template>

    <v-breadcrumbs :items="breadcrumbs" class="breadcrumbs" divider=" / " />

    <v-sheet class="search-sheet rounded-lg mb-4">
      <v-row class="align-center" no-gutters>
        <v-col cols="12" md="6" class="pr-md-4 mb-3 mb-md-0">
          <v-text-field v-model="q" placeholder="Buscar por aluno (RA, nome, CPF)" variant="outlined"
            density="comfortable" hide-details class="search-input" prepend-inner-icon="mdi-magnify"
            @keyup.enter="applySearch" />
        </v-col>

        <v-col cols="12" sm="auto" class="ml-sm-auto">
          <v-btn color="success" class="btn-new" @click="$router.push(routes.create)">
            Cadastrar aluno
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>

    <v-card class="card-plain rounded-lg overflow-hidden">
      <v-data-table :headers="headers" :items="filteredRows" :loading="loading" :items-per-page="10"
        items-per-page-text="Itens por página" page-text="{0}-{1} de {2}" class="rounded-b-lg">
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.cpf="{ item }">
          {{ formatCpf(rowFromSlot(item).cpf) }}
        </template>
        <template #[itemActionsSlot]="{ item }">
          <div class="d-flex ga-2">
            <v-btn size="small" class="btn-edit" @click="$router.push(routes.edit(rowFromSlot(item).ra))">
              Editar
            </v-btn>
            <v-btn size="small" class="btn-delete" @click="confirmDelete(rowFromSlot(item).ra)">
              Excluir
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <div class="pa-6 text-medium-emphasis">Sem registros</div>
        </template>
      </v-data-table>
    </v-card>

    <ConfirmDeleteDialog v-model="del.open" :ra="del.ra" :loading="deleting" @confirm="doDelete" />

    <v-snackbar v-model="feedback.open" :timeout="3000" :color="feedback.color">
      {{ feedback.message }}
    </v-snackbar>
  </AcademicLayout>
</template>

<style scoped>
.breadcrumbs {
  color: #3c4043;
  font-size: 20px;
  margin: 8px 0 16px;
  display: flex;
  align-items: baseline;
}

.btn-new {
  height: 46px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .15);
}

.search-input :deep(.v-field) {
  height: 46px;
  border-radius: 12px;
}

.btn-edit,
.btn-delete {
  min-width: 0;
  padding: 0 14px;
  border-radius: 8px;
  font-weight: 600;
  color: #fff;
}

.btn-edit {
  background-color: #1e88e5;
}

.btn-edit:hover {
  background-color: #1669b7;
}

.btn-delete {
  background-color: #e53935;
}

.btn-delete:hover {
  background-color: #c62828;
}

.card-plain {
  border: 1px solid rgba(0, 0, 0, .12);
  border-radius: 16px;
}

.search-sheet {
  background-color: #f5f6f7;
  border: 1px solid rgba(0, 0, 0, .08);
  padding: 24px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border-radius: 16px;
}

@media (max-width: 600px) {
  .btn-new {
    width: 100%;
  }

  .search-sheet {
    padding: 18px;
  }

  .breadcrumbs {
    font-size: 18px;
  }
}
</style>
