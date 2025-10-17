<template>
  <v-app>
    <v-app-bar flat class="app-bar">
      <v-btn variant="text" class="logo-btn" to="/">
        <img src="/maisaeducacaologo.png" alt="+A Educação" class="logo-img" />
      </v-btn>
    </v-app-bar>

    <v-main class="pa-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts"></script>

<style scoped>
.app-bar {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.logo-btn {
  padding: 0;
  min-width: 0;
}

.logo-img {
  height: 44px;
  width: auto;
  display: block;
}
</style>
