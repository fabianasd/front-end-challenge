import { defineStore } from 'pinia'
import { listStudents } from '../api/studentsAPI'
import type { Student } from '../types/Student'

export const useStudentsStore = defineStore('users', {
  state: () => ({ items: [] as Student[], loading: false, error: '' as string|undefined }),
  actions: {
    async fetchAll() {
      this.loading = true
      this.error = undefined
      try {
        this.items = await listStudents()
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Failed to load'
      } finally {
        this.loading = false
      }
    },
  },
})
