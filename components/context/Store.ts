import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  loginState: boolean
  setLoginState: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(set => ({
  loginState: false,
  setLoginState: state => set({ loginState: state }),
}))
