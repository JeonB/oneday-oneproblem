import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getSession } from 'next-auth/react'

interface AuthState {
  loginState: boolean
  setLoginState: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      loginState: false,
      setLoginState: state => set({ loginState: state }),
    }),
    {
      name: 'auth-storage', // Local storage key
      storage: createJSONStorage(() => localStorage), // Use local storage
    },
  ),
)

// Set initial state based on session information
getSession().then(session => {
  const isLogin = !!session && session.user !== undefined
  useAuthStore.getState().setLoginState(isLogin)
})
