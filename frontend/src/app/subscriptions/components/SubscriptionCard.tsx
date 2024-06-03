"use client"

import { Subscription } from "@/types/subscription.types";
import { addMonths, differenceInCalendarDays, format, isBefore, isToday, parseISO, setMonth } from 'date-fns';
import { Bell, BellOff, Pencil } from 'lucide-react';
import { useCallback, useEffect, useState } from "react";

type SubscriptionCardProps = {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onNotify: (subscription: Subscription) => void;
};

function adjustNextPaymentDate(nextPaymentAt: string): Date {
  const now = new Date();
  let nextPaymentDate = parseISO(nextPaymentAt);

  // Set the next payment date to the current month
  nextPaymentDate = setMonth(nextPaymentDate, now.getMonth());

  // If the adjusted next payment date is before the current date, move it to the next month
  if (isBefore(nextPaymentDate, now) && !isToday(nextPaymentDate)) {
    nextPaymentDate = addMonths(nextPaymentDate, 1);
  }

  return nextPaymentDate;
}

export function SubscriptionCard(props: SubscriptionCardProps) {
  const { subscription, onEdit, onNotify } = props;
  const { service, note, price, isNotifying, nextPaymentAt } = subscription;

  const editHandler = useCallback(() => {
    onEdit(subscription);
  }, [onEdit, subscription]);

  const notifyHandler = useCallback(() => {
    onNotify(subscription);
  }, [onNotify, subscription]);

  const [paymentMessage, setPaymentMessage] = useState<string>('');
  const [adjustedDate, setAdjustedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (nextPaymentAt) {
      const adjustedDate = adjustNextPaymentDate(nextPaymentAt);
      const now = new Date();

      const daysUntilNextPayment = differenceInCalendarDays(adjustedDate, now);

      let message;
      if (daysUntilNextPayment > 1) {
        message = `in ${daysUntilNextPayment} days`;
      } else if (daysUntilNextPayment === 1) {
        message = `in 1 day`;
      } else if (isToday(adjustedDate)) {
        message = "today";
      } else {
        message = `in ${daysUntilNextPayment + 1} days`; // Handle cases where the date has already passed in the current month
      }

      setAdjustedDate(adjustedDate);
      setPaymentMessage(message);
    }
  }, [nextPaymentAt]);

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
        {adjustedDate && (
          <div className="flex flex-col items-center">
            <p className="text-base text-gray-600">{format(adjustedDate, 'dd.MM.yyyy')}</p>
            <p className="text-sm text-gray-400">{paymentMessage}</p>
          </div>
        )}

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
  );
}