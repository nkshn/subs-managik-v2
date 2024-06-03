import { userService } from "@/services/user.service"
import { ProfileFormInputs } from "@/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export function useUpdateProfile() {
	const queryClient = useQueryClient()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['update-profile'],
		mutationFn: (data: ProfileFormInputs) => userService.updateProfile(data),
		onSuccess() {
      toast.success('Successfully updated profile!', {
        position: 'bottom-center',
        duration: 3000,
      })
			queryClient.invalidateQueries({ queryKey: ['profile'] })
		}
	})

	return {
    mutate,
    isLoading: isPending,
    isSuccess,
  }
}