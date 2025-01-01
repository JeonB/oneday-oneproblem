import { create } from 'zustand'
import { Algorithm } from '@/app/lib/models/Algorithms'
import { persist } from 'zustand/middleware'

interface AuthState {
  loginState: boolean
  setLoginState: (state: boolean) => void
}

interface SignUpState {
  name: string
  email: string
  password: string
  setName: (name: string) => void
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

interface AlgorithmState {
  isLoading: boolean
  algorithms: Algorithm[]
  setAlgorithms: (algorithms: Algorithm[]) => void
  fetchAlgorithms: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      loginState: false,
      setLoginState: state => set({ loginState: state }),
    }),
    {
      name: 'auth-store',
      partialize: state => ({ loginState: state.loginState }),
    },
  ),
)

export const useSignInAndUpStore = create<SignUpState>(set => ({
  name: '',
  email: '',
  password: '',
  setName: name => set({ name }),
  setEmail: email => set({ email }),
  setPassword: password => set({ password }),
}))

export const useAlgorithmStore = create<AlgorithmState>()(
  persist(
    (set, get) => ({
      algorithms: [],
      isLoading: false,
      setAlgorithms: algorithms => set({ algorithms }),
      fetchAlgorithms: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/algorithms')
          if (!response.ok) {
            throw new Error(
              `Failed to fetch algorithms: ${response.statusText}`,
            )
          }
          const data: Algorithm[] = await response.json()
          set({ algorithms: data })
        } catch (error) {
          console.error('Failed to fetch algorithms:', error)
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'algorithm-store',
      partialize: state => ({ algorithms: state.algorithms }),
    },
  ),
)
