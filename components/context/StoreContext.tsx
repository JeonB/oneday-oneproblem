'use client'
import React, { createContext, useContext, useRef } from 'react'
import { useStore, type StoreApi } from 'zustand'
import {
  type AuthState,
  type ProblemState,
  type SignInAndUpState,
  createAuthStore,
  createProblemStore,
  createSignInAndUpStore,
  initSignUpStore,
  initAuthStore,
  initProblemStore,
} from '@/components/context/Store'

interface StoreContextType {
  authStore: StoreApi<AuthState>
  problemStore: StoreApi<ProblemState>
  signInAndUpStore: StoreApi<SignInAndUpState>
}

const OneDayContext = createContext<StoreContextType | undefined>(undefined)

export const OneDayProvider = ({ children }: { children: React.ReactNode }) => {
  const authStoreRef = useRef<StoreApi<AuthState>>(
    createAuthStore(initAuthStore()),
  )
  const signInAndUpStoreRef = useRef<StoreApi<SignInAndUpState>>(
    createSignInAndUpStore(initSignUpStore()),
  )
  const problemStoreRef = useRef<StoreApi<ProblemState>>(
    createProblemStore(initProblemStore()),
  )

  if (!authStoreRef.current)
    authStoreRef.current = createAuthStore(initAuthStore())
  if (!signInAndUpStoreRef.current)
    signInAndUpStoreRef.current = createSignInAndUpStore(initSignUpStore())
  if (!problemStoreRef.current)
    problemStoreRef.current = createProblemStore(initProblemStore())

  return (
    <OneDayContext.Provider
      value={{
        authStore: authStoreRef.current,
        signInAndUpStore: signInAndUpStoreRef.current,
        problemStore: problemStoreRef.current,
      }}>
      {children}
    </OneDayContext.Provider>
  )
}

export const useAuthStore = <T,>(selector: (state: AuthState) => T): T => {
  const context = useContext(OneDayContext)
  if (!context)
    throw new Error('useAuthStore must be used within StoreProvider')
  return useStore(context.authStore, selector)
}

export const useSignInAndUpStore = <T,>(
  selector: (state: SignInAndUpState) => T,
): T => {
  const context = useContext(OneDayContext)
  if (!context)
    throw new Error('useSignUpStore must be used within StoreProvider')
  return useStore(context.signInAndUpStore, selector)
}

export const useProblemStore = <T,>(
  selector: (state: ProblemState) => T,
): T => {
  const context = useContext(OneDayContext)
  if (!context)
    throw new Error('useProblemStore must be used within StoreProvider')
  return useStore(context.problemStore, selector)
}
