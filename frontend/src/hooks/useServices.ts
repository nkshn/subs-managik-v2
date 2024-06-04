import { useQuery } from '@tanstack/react-query'

import { serviceForSubscriptionService } from '@/services/service.service'

export function useServices() {
	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['services'],
		queryFn: () => serviceForSubscriptionService.getAllServices(),
	})

	return { data, isLoading, isSuccess }
}
