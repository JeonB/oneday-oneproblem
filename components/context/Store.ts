import { create, StoreApi } from 'zustand'

export interface AuthState {
  loginState: boolean
  setLoginState: (state: boolean) => void
}
export const initAuthStore = (): AuthState => ({
  loginState: false,
  setLoginState: () => {},
})
export const createAuthStore = (initState: AuthState): StoreApi<AuthState> =>
  create<AuthState>()(set => ({
    ...initState,
    setLoginState: state => set({ loginState: state }),
  }))

export interface SignInAndUpState {
  name: string
  email: string
  password: string
  setName: (name: string) => void
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}
export const initSignUpStore = (): SignInAndUpState => ({
  name: '',
  email: '',
  password: '',
  setName: () => {},
  setEmail: () => {},
  setPassword: () => {},
})
export const createSignInAndUpStore = (
  initState: SignInAndUpState,
): StoreApi<SignInAndUpState> =>
  create<SignInAndUpState>()(set => ({
    ...initState,
    setName: name => set({ name }),
    setEmail: email => set({ email }),
    setPassword: password => set({ password }),
  }))

export interface AiGeneratedContent {
  input: string[] | string
  output: string | string[] | undefined
}

export interface ProblemState {
  title: string
  topic: string
  difficulty: string
  inputOutput: AiGeneratedContent[]
  userSolution: string
  content: string
  setTitle: (title: string) => void
  setTopic: (topic: string) => void
  setDifficulty: (difficulty: string) => void
  setInputOutput: (inputOutput: AiGeneratedContent[]) => void
  setUserSolution: (userSolution: string) => void
  setContent: (content: string) => void
}
export const initProblemStore = (): ProblemState => ({
  title: '',
  topic: '',
  difficulty: '',
  inputOutput: [],
  userSolution: '',
  content: '',
  setTitle: () => {},
  setTopic: () => {},
  setDifficulty: () => {},
  setInputOutput: () => {},
  setUserSolution: () => {},
  setContent: () => {},
})
export const createProblemStore = (
  initState: ProblemState,
): StoreApi<ProblemState> =>
  create<ProblemState>()(set => ({
    ...initState,
    setTitle: title => set({ title }),
    setTopic: topic => set({ topic }),
    setDifficulty: difficulty => set({ difficulty }),
    setInputOutput: inputOutput => set({ inputOutput }),
    setUserSolution: userSolution => set({ userSolution }),
    setContent: content => set({ content }),
  }))
