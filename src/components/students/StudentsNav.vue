<script setup lang="ts">
import type { PropType } from 'vue';

type Routes = {
  list: string;
  create: string;
  edit: (ra: string) => string;
};

const props = defineProps({
  active: { type: Boolean, default: false },
  routes: { type: Object as PropType<Routes>, required: true },
});
</script>

<template>
  <div class="drawer">
    <div class="drawer-header">
      <div class="drawer-module">Módulo Acadêmico</div>
    </div>
    <v-divider class="drawer-divider" />

    <v-list density="comfortable" nav>
      <v-list-group :value="active">
        <template #activator="{ props: actProps }">
          <v-list-item
            v-bind="actProps"
            prepend-icon="mdi-account-school"
            title="Alunos"
            class="drawer-pill"
            :active="active"
          />
        </template>

        <v-list-item
          prepend-icon="mdi-table-search"
          title="Consultar alunos"
          :to="routes.list"
          class="child-item"
        />

        <v-list-item
          prepend-icon="mdi-plus-circle-outline"
          title="Cadastrar aluno"
          :to="routes.create"
          class="child-item"
        />
      </v-list-group>
    </v-list>
  </div>
</template>

<style scoped>
.drawer { background: #1f1f1f; color: #fff; border-radius: 16px; overflow: hidden; }
.drawer-header { padding: 14px 16px 10px; }
.drawer-module { margin-top: 2px; font-weight: 600; color: #e0e0e0; font-size: 16px; }
.drawer-divider { opacity: .2; }

.drawer-pill { border-radius: 10px; margin: 2px 2px; background: rgba(255,255,255,.08); padding-inline: 10px; }
.child-item { margin-left: 8px; border-radius: 8px; padding-inline: 10px; }
.child-item.v-list-item--active { background: rgba(255,255,255,.12); }

:deep(.v-list-item__prepend) { margin-inline-end: 8px; }
:deep(.v-icon) { color: #fff; font-size: 20px; }
:deep(.v-list-item-title) { font-weight: 600; letter-spacing: 0.2px; }
</style>
