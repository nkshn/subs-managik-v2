import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authService } from '@/services/auth.service'
import { toast } from 'sonner'

export function useLogout() {
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ['logout'],
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      toast.success('Successfully logout!', {
        position: 'bottom-center',
        duration: 3000,
      })

      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  return {
    mutate,
    isLoading: isPending,
    isSuccess,
  }
}
