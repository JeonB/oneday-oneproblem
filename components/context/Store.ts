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

export type AiGeneratedContent = {
  input: string[] | string
  output: string | string[] | undefined
}
interface ProblemState {
  topic: string
  difficulty: string
  inputOutput: AiGeneratedContent[]
  userSolution: string
  content: string
  setTopic: (topic: string) => void
  setDifficulty: (difficulty: string) => void
  setInputOutput: (inputOutput: AiGeneratedContent[]) => void
  setUserSolution: (userSolution: string) => void
  setContent: (content: string) => void
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

export const useProblemStore = create<ProblemState>(set => ({
  topic: '',
  difficulty: '',
  inputOutput: [],
  userSolution: '',
  content: '',
  setTopic: topic => set({ topic }),
  setDifficulty: difficulty => set({ difficulty }),
  setInputOutput: inputOutput => set({ inputOutput }),
  setUserSolution: userSolution => set({ userSolution }),
  setContent: content => set({ content }),
}))
