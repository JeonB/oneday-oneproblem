import { create } from 'zustand'
import { Algorithm } from '@/app/lib/models/Algorithms'
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
  algorithms: Algorithm[]
  setAlgorithms: (algorithms: Algorithm[]) => void
}

export const useAuthStore = create<AuthState>()(set => ({
  loginState: false,
  setLoginState: state => set({ loginState: state }),
}))

export const useSignInAndUpStore = create<SignUpState>(set => ({
  name: '',
  email: '',
  password: '',
  setName: name => set({ name }),
  setEmail: email => set({ email }),
  setPassword: password => set({ password }),
}))

export const useAlgorithmStore = create<AlgorithmState>(set => ({
  algorithms: [],
  setAlgorithms: algorithms => set({ algorithms }),
}))
