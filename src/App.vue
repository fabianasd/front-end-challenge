<template>
  <v-app>
    <v-app-bar flat class="app-bar">
      <v-btn variant="text" class="logo-btn" to="/">
        <img src="/maisaeducacaologo.png" alt="+A Educação" class="logo-img" />
      </v-btn>

      <v-spacer />

      <v-menu v-if="auth.isAuthenticated" v-model="userMenu" location="bottom end" transition="fade-transition" offset="12">
        <template #activator="{ props }">
          <v-btn v-bind="props" class="user-btn" aria-label="Perfil do usuário" icon variant="flat">
            <v-avatar size="40" color="#e0e0e0">
              <span class="user-btn__initial">{{ userInitial }}</span>
            </v-avatar>
          </v-btn>
        </template>

        <v-card class="user-card" elevation="12">

          <v-btn icon="mdi-close" variant="text" density="comfortable" class="user-card__close"
            @click="userMenu = false" />

          <div class="user-card__profile">
            <div class="user-card__avatar">
              <v-avatar size="72" color="#0097a7">
                <span>{{ userInitial }}</span>
              </v-avatar>
              <v-btn icon="mdi-camera-outline" size="x-small" class="user-card__avatar-edit" variant="flat" />
            </div>
            <div class="user-card__greeting">{{ greeting }}</div>
          </div>

          <v-divider class="user-card__divider" />

          <v-btn class="user-card__logout" variant="text" @click="onLogout">
            Sair
          </v-btn>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main class="pa-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const userMenu = ref(false)
const router = useRouter()
const auth = useAuthStore()

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Usuário')
const userInitial = computed(() => displayName.value.charAt(0).toUpperCase())
const greeting = computed(() => `Olá, ${displayName.value.split(' ')[0]}!`)

async function onLogout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.app-bar {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 0 16px 0 8px;
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

.user-btn {
  color: #424242;
  min-width: auto;
  border-radius: 999px;
  background: #f5f5f5;
  padding: 6px;
}

.user-btn__initial {
  font-weight: 600;
  color: #424242;
}

.user-card {
  position: relative;
  min-width: 200px;
  max-width: 200px;
  background: #ffffff;
  color: #3c4043;
  border-radius: 18px;
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

.user-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #5f6368;
}

.user-card__close {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #9aa0a6;
}

.user-card__profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.user-card__avatar {
  position: relative;
}

.user-card__avatar :deep(.v-avatar) {
  font-size: 32px;
  font-weight: 600;
  color: #fff;
}

.user-card__avatar-edit {
  position: absolute;
  bottom: 2px;
  right: 2px;
  border-radius: 999px;
  background: #202124;
  color: #e8eaed;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  width: 28px;
  height: 28px;
  min-width: 28px;
  padding: 0;
}

.user-card__greeting {
  font-size: 20px;
  font-weight: 500;
  color: #3c4043;
  text-align: center;
}

.user-card__divider {
  border-color: rgba(60, 64, 67, 0.12);
  margin: 0;
}

.user-card__logout {
  color: #4285f4;
  align-self: center;
  text-align: center;
  padding-inline: 16px;
}
</style>
