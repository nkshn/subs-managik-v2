"use client"

import { Button } from "flowbite-react"
import { CirclePlus, PlusIcon, RefreshCwIcon } from "lucide-react"
import { useState } from "react"

import {
  Subscription,
  SubscriptionFormInputs
} from "@/types/subscription.types"

import { SubscriptionCard } from "./components/SubscriptionCard"
import { SubscriptionModal } from "./components/SubscriptionModal"

const SUBSCRIPTIONS: Subscription[] = [
  {
    id: 1,
    service: { id: 1, fullName: "Spotify", shortName: "SP", backgroundColor: "#1DB954" },
    price: 2.22,
    note: "батьківський megogo",
    isNotifying: true,
    nextPaymentAt: "2024-04-15T17:20:13.256Z"
  },
  {
    id: 2,
    service: { id: 6, fullName: "GitHub Copilot", shortName: "GC", backgroundColor: "#6CC644" },
    price: 9.99,
    note: "",
    isNotifying: false,
    nextPaymentAt: "2024-04-20T17:20:13.256Z"
  },
  {
    id: 3,
    service: { id: 2, fullName: "YouTube Music", shortName: "YT", backgroundColor: "#FF0000" },
    price: 19.99,
    note: "мій fr gfn",
    isNotifying: false,
    nextPaymentAt: "2024-04-28T17:20:13.256Z"
  }
]

export default function Subscriptions() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)

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
  const handleSubscriptiEdit = (subscription: Subscription): void => {
    console.log("edit subscription", subscription)

    setEditingSubscription(subscription)
    setModalOpen(true)
  }

  // change notification of subscription
  const handleSubscriptiNotify = (subscription: Subscription): void => {
    console.log("change notification of", subscription)
  }

  // save new subscription
  const handleSaveSubscription = (data: SubscriptionFormInputs): void => {
    console.log("save subscription", data)
  }

  // delete subscription
  const handleDeleteSubscription = (data: Subscription): void => {
    console.log("delete subscription", data)
  }

  return (
    <section className="bg-white w-3/4 mx-auto my-14">
      {SUBSCRIPTIONS.length !== 0 ? (
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
        {SUBSCRIPTIONS.length === 0 ? (
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
          SUBSCRIPTIONS.map((subscription: Subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onEdit={handleSubscriptiEdit}
              onNotify={handleSubscriptiNotify}
            />
          ))
        }
      </div>

      <SubscriptionModal
        isOpen={isModalOpen}
        initialData={editingSubscription || null}
        onClose={handleCloseModal}
        onAddOrEditSubmit={handleSaveSubscription}
        onDelete={editingSubscription ? handleDeleteSubscription : null}
      />
    </section>
  )
}
