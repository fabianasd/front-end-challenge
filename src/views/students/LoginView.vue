<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

async function onSubmit() {
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.login({ email: email.value.trim(), password: password.value })
    const redirect = (route.query.redirect as string) || '/students'
    router.replace(redirect)
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message || 'Falha no login'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container class="fill-height login-wrap" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card elevation="3" class="login-card">
          <v-card-text>
            <v-alert v-if="errorMsg" type="error" density="compact" class="mb-3">{{ errorMsg }}</v-alert>

            <v-form @submit.prevent="onSubmit" class="login-form">
              <v-label class="login-label">Usuário</v-label>
              <v-text-field
                v-model="email"
                type="email"
                variant="underlined"
                hide-details
                autocomplete="username"
              />

              <v-label class="login-label mt-4">Senha</v-label>
              <v-text-field
                v-model="password"
                type="password"
                variant="underlined"
                hide-details
                autocomplete="current-password"
              />

              <v-btn :loading="loading" type="submit" class="btn-primary mt-6" block>Entrar</v-btn>

              <v-divider class="my-6" />

              <div class="demo-users">
                <div class="demo-title">Usuários de demonstração</div>
                <ul class="demo-list">
                  <li>
                    <strong>Usuário:</strong> admin@email.com
                    <strong>Senha:</strong> 12345678
                    <strong>Permissões:</strong> Registro e leitura de aluno; Criação de usuários (users:create)
                  </li>
                  <li>
                    <strong>Usuário:</strong> joao-reader@email.com
                    <strong>Senha:</strong> 12345678
                    <strong>Permissões:</strong> Leitura de aluno
                  </li>
                  <li>
                    <strong>Usuário:</strong> joao-creator@email.com
                    <strong>Senha:</strong> 12345678
                    <strong>Permissões:</strong> Registro de aluno
                  </li>
                </ul>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.login-wrap {
  background: #ffffff;
}

.login-card {
  border-radius: 8px;
}

.brand {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

.brand__img {
  height: 42px;
  width: auto;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-label {
  font-size: 14px;
  color: #2d3b45;
}

.btn-primary {
  background-color: #3b78b2;
  color: #fff;
}

.btn-primary:hover {
  background-color: #2f6394;
}

.demo-users {
  margin-top: 8px;
  color: #2d3b45;
}

.demo-title {
  font-weight: 600;
  margin-bottom: 6px;
}

.demo-list {
  margin: 0;
  padding-left: 18px;
}

.demo-list li {
  margin: 2px 0;
}
</style>
