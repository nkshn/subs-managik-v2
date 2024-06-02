"use client"
import { Subscription } from "@/types/subscription.types";
import dayjs from "dayjs"

import { Pencil, Bell, BellOff } from 'lucide-react'
import { useCallback } from "react"


type SubscriptionCardProps = {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onNotify: (subscription: Subscription) => void;
};

export function SubscriptionCard(props: SubscriptionCardProps) {
  const { subscription, onEdit, onNotify } = props
  const { id, service, note, price, isNotifying, nextPaymentAt } = subscription

  const editHandler = useCallback(() => {
    onEdit(subscription);
  }, [onEdit, subscription])

  const notifyHandler = useCallback(() => {
    onNotify(subscription);
  }, [onNotify, subscription])

  return (
    <div className="flex flex-col gap-4 bg-slate-100 border-solid rounded-lg duration-150 hover:shadow-md py-5">
      <div className="flex flex-row justify-between items-center px-5">
        <div className="flex flex-row gap-4 w-1/3 items-center">
          <div
            className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-300 rounded-full"
            style={{ backgroundColor: service.backgroundColor }}
          >
            <span className="font-semibold text-white uppercase">
              {service.shortName}
            </span>
          </div>
          <div>
            <h4 className="text-lg text-slate-600 font-bold">
              {service.fullName}
            </h4>
            {note && (
              <p className="text-base text-slate-400">{note}</p>
            )}
          </div>
        </div>

        <p className="font-bold">{price} $</p>
        <p>{dayjs(nextPaymentAt).format("DD/MM/YYYY")}</p>

        <div className="flex flex-row gap-3">
          <button
            className="btn btn-primary p-2 hover:bg-slate-300 hover:rounded-full duration-150"
            onClick={notifyHandler}
          >
            {isNotifying ? <Bell /> : <BellOff />}
          </button>

          <button
            onClick={editHandler}
            className="btn btn-primary p-2 hover:bg-slate-300 hover:rounded-full duration-150"
          >
            <Pencil />
          </button>
        </div>
      </div>
    </div>
  )
}
