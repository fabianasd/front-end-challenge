<template>
  <v-layout class="min-h-screen">
    <v-app-bar app color="white" elevation="0" flat location="top">
      <v-app-bar-title>+A Educação — Matrículas</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer app permanent width="280" class="drawer-dark" elevation="0">
      <div class="drawer-header">
        <div class="drawer-module">Módulo Acadêmico</div>
      </div>
      <v-divider class="drawer-divider" />
      <v-list density="comfortable" nav>
        <v-list-group v-model="alunosOpen">
          <template #activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-account-school" title="Alunos" class="drawer-pill"
              :active="route.path.startsWith(baseRoute)" />
          </template>

          <v-list-item prepend-icon="mdi-table-search" title="Consultar alunos" :to="routes.list" class="child-item"
            :active="route.path === routes.list" />

          <v-list-item prepend-icon="mdi-plus-circle-outline" title="Cadastrar aluno" :to="routes.create"
            class="child-item" :active="route.path === routes.create" />
        </v-list-group>
      </v-list>

    </v-navigation-drawer>

    <v-main class="main-shell">
      <v-container class="main-container">
        <v-breadcrumbs :items="breadcrumbs" class="breadcrumbs" divider=" / " />
        <v-sheet class="search-sheet rounded-lg mb-4">
          <v-row class="align-center" no-gutters>
            <v-col cols="12" md="6" class="pr-md-4 mb-3 mb-md-0">
              <v-text-field
                v-model="q"
                placeholder="Buscar por aluno (RA, nome, CPF)"
                variant="outlined"
                density="comfortable"
                hide-details
                class="search-input"
                @keyup.enter="applySearch"
              />
            </v-col>

            <v-col cols="12" sm="auto" class="mb-3 mb-sm-0">
              <v-btn class="btn-search" color="primary" @click="applySearch">
                Pesquisar
              </v-btn>
            </v-col>

            <v-col cols="12" sm="auto" class="ml-sm-auto">
              <v-btn color="success" class="btn-new" @click="$router.push(routes.create)">
                Cadastrar aluno
              </v-btn>
            </v-col>
          </v-row>
        </v-sheet>

        <v-card class="rounded-lg overflow-hidden card-plain">
          <v-data-table :headers="headers" :items="filteredRows" :loading="loading" :items-per-page="10"
            class="rounded-b-lg">
            <template #item.actions="{ item }">
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
      </v-container>
    </v-main>

    <v-dialog v-model="del.open" max-width="420">
      <v-card>
        <v-card-title>Confirmar exclusão</v-card-title>
        <v-card-text>Tem certeza que deseja excluir o aluno {{ del.ra }}?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="del.open = false">Cancelar</v-btn>
          <v-btn color="error" @click="doDelete">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useStudentsList } from '@/composables/useStudentsList'

const baseRoute = '/users'
const routes = {
  list: baseRoute,
  create: `${baseRoute}/new`,
  edit: (ra: string) => `${baseRoute}/${encodeURIComponent(ra)}/edit`,
}

const route = useRoute()

const {
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
} = useStudentsList({ baseRoute })

init(route)
</script>

<style scoped>

.drawer-dark {
  background: #1f1f1f;
  color: #fff;
  border-radius: 16px;
  overflow: hidden;
}

.drawer-dark :deep(.v-navigation-drawer__content) {
  padding-top: 0;
}

.drawer-dark :deep(.v-navigation-drawer__scrim) {
  display: none;
}

.drawer-header {
  padding: 14px 16px 10px;
}

.drawer-app {
  font-size: 14px;
  color: #bdbdbd;
  line-height: 1.2;
}

.drawer-module {
  margin-top: 2px;
  font-weight: 600;
  color: #e0e0e0;
  font-size: 16px;
}

.drawer-divider {
  opacity: .2;
}

.drawer-pill {
  border-radius: 10px;
  margin: 2px 2px;
  background: rgba(255, 255, 255, .08);
  padding-inline: 10px;
}

.child-item {
  margin-left: 8px;
  border-radius: 8px;
  padding-inline: 10px;
}

.child-item.v-list-item--active {
  background: rgba(255, 255, 255, .12);
}

.drawer-pill :deep(.v-list-item__prepend) {
  margin-inline-end: 8px;
}

.drawer-pill :deep(.v-icon) {
  color: #fff;
  font-size: 20px;
}

.drawer-pill :deep(.v-list-item-title) {
  font-weight: 600;
  letter-spacing: 0.2px;
}

.main-shell {
  padding-top: 16px !important;
}

.main-container {
  padding: 30px 20px 10px !important;
}

.breadcrumb {
  position: relative;
  z-index: 1;
  color: #3c4043;
  font-size: 20px;
  line-height: 1.3;
  margin: 8px 0 16px;
  display: flex;
  align-items: baseline;
}

.breadcrumb .sep {
  margin: 0 8px;
  color: #9aa0a6;
  font-weight: 400;
}

.breadcrumb .crumb.bold {
  font-weight: 700;
}

.btn-search,
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

.btn-search {
  height: 46px;
  padding: 0 22px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .15);
}

.btn-new {
  height: 46px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .15);
}

@media (max-width: 600px) {

  .btn-new,
  .btn-search {
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
