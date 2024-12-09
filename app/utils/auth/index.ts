import { useState, useEffect } from 'react'

export const useUser = () => {
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user')
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        setUser(null)
      }
    }

    fetchUser()
    const intervalId = setInterval(fetchUser, 60000) // 1분마다 사용자 정보 갱신

    return () => clearInterval(intervalId)
  }, [])

  return user
}
