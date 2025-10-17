<script setup lang="ts">
defineProps<{ modelValue: boolean; ra?: string; loading?: boolean }>()
const emit = defineEmits<{ (e:'update:modelValue', v:boolean):void; (e:'confirm'):void }>()
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="v=>emit('update:modelValue', v)" max-width="420">
    <v-card>
      <v-card-title>Confirmar exclusão</v-card-title>
      <v-card-text>Tem certeza que deseja excluir o aluno {{ ra }}?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn class="btn-cancel" variant="flat" @click="emit('update:modelValue', false)">
          Cancelar
        </v-btn>
        <v-btn class="btn-confirm" @click="emit('confirm')" :loading="loading">
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.btn-cancel {
  background: #eceff1;
  color: #455a64;
  font-weight: 600;
}

.btn-cancel:hover {
  background: #cfd8dc;
}

.btn-confirm {
  background: #e53935;
  color: #fff;
  font-weight: 600;
}

.btn-confirm:hover {
  background: #c62828;
}
</style>
