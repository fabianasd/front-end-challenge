<template>
  <v-layout class="min-h-screen">
    <v-app-bar app color="white" elevation="0" flat class="app-bar">
      <v-app-bar-title class="brand-title">
        <slot name="brand">
          <span v-if="title">{{ title }}</span>
        </slot>
      </v-app-bar-title>
      <v-spacer />
      <slot name="app-bar-actions" />
    </v-app-bar>

    <v-navigation-drawer app permanent width="280" class="drawer-dark" elevation="0">
      <slot name="nav" />
    </v-navigation-drawer>

    <v-main class="layout-main">
      <div class="layout-content">
        <slot />
      </div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.layout-main {
  padding-top: 16px !important;
}

.layout-content {
  padding: 16px 32px 40px;
}

.app-bar {
  padding-left: 8px;
}

.brand-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 960px) {
  .layout-content {
    padding: 16px;
  }
}
</style>
