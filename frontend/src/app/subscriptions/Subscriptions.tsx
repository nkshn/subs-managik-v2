"use client"

import { Button } from "flowbite-react"
import { CirclePlus, PlusIcon } from "lucide-react"
import { useMemo, useState } from "react"

import {
  Subscription,
  SubscriptionFormInputs
} from "@/types/subscription.types"

import Loader from "@/components/ui/Loader"
import { APP_PAGES } from "@/config/pages-url.config"
import { useGetSubscriptions } from "@/hooks/useGetSubscriptions"
import { useProfile } from "@/hooks/useProfile"
import { userSubscriptionService } from "@/services/user-subscription.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { toast } from "sonner"
import { SubscriptionCard } from "./components/SubscriptionCard"
import { SubscriptionModal } from "./components/SubscriptionModal"

export default function Subscriptions() {
  const queryClient = useQueryClient()

  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)

  const { data: user, isLoading: isUserLoading } = useProfile()
  const { data: subscriptions, isLoading: isSubscriptionsLoading } = useGetSubscriptions()

  const { mutateAsync: updateNotificationSubscription } = useMutation({
    mutationKey: ['update-subscription-notification'],
    mutationFn: async ({ subscriptionId, data }: { subscriptionId: string, data: SubscriptionFormInputs }) => userSubscriptionService.updateSubscription(subscriptionId || '', data),
    onSuccess() {
      toast.success('Successfully updated your subscription!', {
        position: 'bottom-center',
        duration: 3000,
      })

      queryClient.refetchQueries({
        queryKey: ["subscriptions"],
      });
    },
    onError: () => {
      toast.error("Failed to updated you subscription!", {
        position: 'bottom-center',
        duration: 3000,
      })
    },
  })

  // open modal window to add new subscription
  const handleAddNewSubscription = (): void => {
    setEditingSubscription(null)
    setModalOpen(true)
  }

  // close modal window
  const handleCloseModal = (): void => {
    setModalOpen(false)
  }

  // edit subscription
  const handleSubscriptionEdit = (subscription: Subscription): void => {
    setEditingSubscription(subscription)
    setModalOpen(true)
  }

  // change notification of subscription
  const handleSubscriptionNotify = (subscription: Subscription): void => {
    updateNotificationSubscription({
      subscriptionId: subscription.id || "",
      data: {
        serviceId: subscription.service.id,
        note: subscription.note,
        price: subscription.price,
        isNotifying: !subscription.isNotifying || false,
        nextPaymentAt: subscription.nextPaymentAt,
      }
    })
  }

  const isAuthorized = useMemo(() => (
    Boolean(user && !isUserLoading)
  ), [user, isUserLoading]);

  if (isSubscriptionsLoading || isUserLoading) {
    return <Loader />
  }

  if (!isAuthorized && !isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh">
        <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
        <p className="text-gray-500 mb-6">You need to be logged in to view your subscriptions.</p>
        <div className="flex space-x-4">
          <Button as={Link} className="flex items-center px-4 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700" href={APP_PAGES.LOGIN}>
            Authorize
          </Button>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-white w-3/4 mx-auto my-14">
      {subscriptions?.length !== 0 ? (
        <div className="w-auto mb-4">
          <Button
            onClick={handleAddNewSubscription}
            className="ml-auto"
          >
            <CirclePlus className="mr-2 h-5 w-5" />
            Add Subscription
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        {subscriptions?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-dvh">
            <h1 className="text-2xl font-bold mb-2">No Subscriptions Yet</h1>
            <p className="text-gray-500 mb-6">You have not subscribed to anything yet.</p>
            <div className="flex space-x-4">
              <button
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={handleAddNewSubscription}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Subscription
              </button>
            </div>
          </div>
        ) :
          subscriptions.map((subscription: Subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onEdit={handleSubscriptionEdit}
              onNotify={handleSubscriptionNotify}
            />
          ))
        }
      </div>

      <SubscriptionModal
        isOpen={isModalOpen}
        initialData={editingSubscription || null}
        onClose={handleCloseModal}
      />
    </section>
  )
}
