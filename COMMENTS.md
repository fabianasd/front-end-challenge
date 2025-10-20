## Decisão da arquitetura utilizada

- Camadas separadas por responsabilidade:
  - UI: `src/views/*` (páginas) e `src/components/*` (componentes apresentacionais, ex.: `ConfirmDeleteDialog.vue`, `StudentsNav.vue`).
  - Lógica de tela: `src/composables/*` concentra regras de negócio e efeitos da página (ex.: `useStudentsList.ts`, `useStudentForm.ts`).
  - Estado: Pinia (`src/stores/students.ts`) para cache de alunos, flags de `loading/error` e ações (`fetchAll`, `removeByRa`).
  - Acesso a dados: `src/api/https.ts` (axios com `VITE_API_BASE_URL`) e `src/api/studentsAPI.ts` (endpoints CRUD).
  - Utilitários e tipos: `src/utils/student.ts` (normalização de payloads do back-end) e `src/types/Student.ts`.
  - Roteamento com Vue Router em `src/router/index.ts` (`/students`, `/students/new`, `/students/:ra/edit`).
- Layout consistente via `src/layouts/AcademicLayout.vue` (app bar, drawer, conteúdo) e feedbacks via `v-snackbar`.

```text
src/                             — Código-fonte do front-end
├─ api/                          — Camada de acesso à API (HTTP)
│  ├─ https.ts                   — Cliente HTTP (ex.: Axios) com baseURL/interceptors
│  └─ studentsAPIs.ts            — Funções REST de Alunos (CRUD, busca, etc.)
├─ components/                   — Componentes reutilizáveis
│  └─ students/
│     ├─ ConfirmDeleteDialog.vue — Diálogo genérico de confirmação de exclusão
│     └─ StudentsNav.vue         — Navegação do módulo “Alunos” (drawer/list)
├─ composables/                  — Composables (lógica reutilizável do Vue)
│  ├─ useStudentForm.ts          — Estado, validação e submit do formulário de aluno
│  └─ useStudentLists.ts         — Lista/paginação/filtros de alunos
├─ layouts/                      — Layouts do app
│  └─ AcademicLayout.vue         — AppBar + Drawer + slot de conteúdo
├─ plugins/                      — Inicialização de plugins/bibliotecas
│  └─ vuetify.ts                 — Instância/config do Vuetify
├─ router/                       — Rotas da aplicação
│  └─ index.ts                   — Definições de rotas (list, create, edit)
├─ stores/                       — Estado global (Pinia)
│  └─ students.ts                — Store de alunos (cache, ações assíncronas)
├─ types/                        — Tipos e interfaces TypeScript
│  └─ students.ts                — Tipos/DTOs de Student/Person/RA
├─ utils/                        — Utilitários/helpers puros
│  └─ students.ts                — formatCpf, validateCpf, normalizeStudent, etc.
├─ views/                        — Páginas (acopladas ao router)
│  └─ students/
│     ├─ StudentFormView.vue     — Tela de criar/editar aluno
│     └─ StudentsListView.vue    — Tela de listagem/busca de alunos
├─ App.vue                       — Componente raiz
├─ env.d.ts                      — Tipos globais do TS para Vite/Volar
└─ main.ts                       — Bootstrap do app (cria app, usa router/pinia/vuetify)
```

Principais decisões:
- Separar regras de negócio da UI via composables para facilitar testes, reuso e manutenção.
- Centralizar chamadas HTTP e normalização de dados para isolar mudanças de API.
- Manter store simples (cache + loading/error) e usar o store apenas onde há benefício claro.

## Bibliotecas de terceiros utilizadas

- axios: chamadas HTTP para a API.
- @mdi/font: ícones Material Design.
- vite: dev server e bundler rápidos.
- eslint: configura lint do código.
- prettier: formatação do código.

## O que eu melhoraria se tivesse mais tempo

- Estados de carregamento melhores (skeletons).
- Testes unitários para composables e componentes. 
- Pipeline de CI (lint/test/build).
- Acessibilidade.
- Modo dark.

