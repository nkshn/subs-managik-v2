import { userSubscriptionService } from '@/services/user-subscription.service'
import { useQuery } from '@tanstack/react-query'

export function useGetSubscriptions() {
	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['subscriptions'],
		queryFn: () => userSubscriptionService.getAllUserSubscriptions(),
	})

	return { data, isLoading, isSuccess }
}
