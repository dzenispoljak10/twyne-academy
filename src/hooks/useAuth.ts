import { useSession } from 'next-auth/react'

export function useAuth() {
  const { data: session, status, update } = useSession()

  return {
    session,
    user: session?.user ?? null,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isAdmin: session?.user.role === 'ADMIN',
    update,
  }
}
