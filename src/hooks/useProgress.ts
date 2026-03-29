import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ProgressUpdatePayload, ProgressUpdateResponse } from '@/types'

export function useProgress() {
  const queryClient = useQueryClient()

  return useMutation<ProgressUpdateResponse, Error, ProgressUpdatePayload>({
    mutationFn: async (payload) => {
      const res = await fetch('/api/fortschritt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to update progress')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
  })
}
