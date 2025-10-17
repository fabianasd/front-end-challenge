<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; ra?: string; loading?: boolean }>();
const emit = defineEmits<{ (e:'update:modelValue', v:boolean):void; (e:'confirm'):void }>();
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="v=>emit('update:modelValue', v)" max-width="420">
    <v-card>
      <v-card-title>Confirmar exclusão</v-card-title>
      <v-card-text>Tem certeza que deseja excluir o aluno {{ ra }}?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="emit('update:modelValue', false)">Cancelar</v-btn>
        <v-btn color="error" @click="emit('confirm')" :loading="loading">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
