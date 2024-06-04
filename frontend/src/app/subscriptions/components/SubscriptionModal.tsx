import { APP_PAGES } from "@/config/pages-url.config";
import { useProfile } from "@/hooks/useProfile";
import { useServices } from "@/hooks/useServices";
import { userSubscriptionService } from "@/services/user-subscription.service";
import { Subscription, SubscriptionFormInputs } from "@/types/subscription.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, Modal } from "flowbite-react";
import { Info } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

interface SubscriptionModalProps {
  isOpen: boolean;
  initialData: Subscription | null;
  onClose: () => void;
}

const validationSchema = yup.object().shape({
  serviceId: yup.string().required("Service is required, pick one from the list"),
  note: yup.string().optional(),
  price: yup.number().required("Price is required").min(0.01, "Price must be greater than 0"),
  nextPaymentAt: yup.string().required("Date of next payments is required, choose one"),
  isNotifying: yup.boolean().default(false),
});

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  initialData,
  onClose,
}) => {
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<SubscriptionFormInputs>({
    resolver: yupResolver<SubscriptionFormInputs>(validationSchema),
    defaultValues: {
      serviceId: initialData?.service?.id || "",
      note: initialData?.note || "",
      price: initialData?.price || 0,
      nextPaymentAt: initialData?.nextPaymentAt ? initialData.nextPaymentAt.split("T")[0] : "",
      isNotifying: initialData?.isNotifying || false,
    },
    values: {
      serviceId: initialData?.service?.id || "",
      note: initialData?.note || "",
      price: initialData?.price || 0,
      nextPaymentAt: initialData?.nextPaymentAt ? initialData.nextPaymentAt.split("T")[0] : "",
      isNotifying: initialData?.isNotifying || false,
    },
  });
  const { data: services, isLoading } = useServices()
  const { data: user, isLoading: isUserLoading } = useProfile()

  const { mutateAsync: createSubscription, isPending: isCreationLoading } = useMutation({
    mutationKey: ['create-subscription'],
    mutationFn: async (data: SubscriptionFormInputs) => userSubscriptionService.createNewSubscription(data),
    onSuccess() {
      toast.success('Successfully added new subscription!', {
        position: 'bottom-center',
        duration: 3000,
      })

      queryClient.refetchQueries({
        queryKey: ["subscriptions"],
      });

      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error("Failed to add new subscription!", {
        position: 'bottom-center',
        duration: 3000,
      })

      // check if errors from server
      if (typeof error?.response?.data?.message === "object" && error?.response?.data?.message?.length > 0) {
        error?.response?.data?.message.forEach((err: any) => {
          setError(err?.type, {
            type: "manual",
            message: err?.message,
          });
        });
      }

      // check if error from yup frone-end validation
      if (error?.response?.data) {
        setError(error?.response?.data?.type, {
          type: "manual",
          message: error?.response?.data?.message,
        });
      }
    },
  })

  const { mutateAsync: updateSubscription, isPending: isUpdatingLoading } = useMutation({
    mutationKey: ['update-subscription'],
    mutationFn: async ({ subscriptionId, data }: { subscriptionId: string, data: SubscriptionFormInputs }) => userSubscriptionService.updateSubscription(subscriptionId || '', data),
    onSuccess() {
      toast.success('Successfully updated your subscription!', {
        position: 'bottom-center',
        duration: 3000,
      })

      queryClient.refetchQueries({
        queryKey: ["subscriptions"],
      })

      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error("Failed to updated you subscription!", {
        position: 'bottom-center',
        duration: 3000,
      })

      // check if errors from server
      if (typeof error?.response?.data?.message === "object" && error?.response?.data?.message?.length > 0) {
        error?.response?.data?.message.forEach((err: any) => {
          setError(err?.type, {
            type: "manual",
            message: err?.message,
          });
        });
      }

      // check if error from yup frone-end validation
      if (error?.response?.data) {
        setError(error?.response?.data?.type, {
          type: "manual",
          message: error?.response?.data?.message,
        });
      }
    },
  })

  const { mutateAsync: deleteSubscription, isPending: isDeletingLoading } = useMutation({
    mutationKey: ['delete-subscription'],
    mutationFn: async (subscriptionId: string) => userSubscriptionService.deleteSubscription(subscriptionId),
    onSuccess() {
      toast.success('Successfully deleted your subscription!', {
        position: 'bottom-center',
        duration: 3000,
      })

      queryClient.refetchQueries({
        queryKey: ["subscriptions"],
      });
    },
    onError: () => {
      toast.error("Failed to delete you subscription!", {
        position: 'bottom-center',
        duration: 3000,
      })
    },
  })

  const handleFormSubmit: SubmitHandler<SubscriptionFormInputs> = async (data: SubscriptionFormInputs) => {
    if (initialData) {
      updateSubscription({ subscriptionId: initialData.id || "", data })
    } else {
      createSubscription(data)
    }
  };

  const handleDeleteSubscription = () => {
    if (initialData) {
      deleteSubscription(initialData.id || "")
      onClose();
    }
  }

  const closeAndClearForm = () => {
    reset();
    onClose();
  }

  const isAuthorized = useMemo(() => (
    Boolean(user && !isUserLoading)
  ), [user, isUserLoading]);

  return (
    <Modal show={isOpen} onClose={closeAndClearForm}>
      <Modal.Header>{initialData ? "Edit Subscription" : "Add Subscription"}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            {!isAuthorized && (
              <div className="mx-auto flex gap-5 flex-col mb-5 border-blue-500 border-solid border-2 items-center bg-blue-300 p-4 rounded-md">
                <div className="flex flex-row gap-3">
                  <Info color="white" />
                  <p className="text-white font-bold">You need to authorize</p>
                </div>
                <p className="text-center text-white">
                  If you want to have SMS notification before upcoming payment you need to <Link href={APP_PAGES.LOGIN} className="font-extrabold text-primary-600 hover:underline">Register</Link> or <Link href={APP_PAGES.LOGIN} className="font-extrabold text-primary-600 hover:underline">Login</Link> to your existing account
                </p>
                <Button as={Link} className="text-white bg-transparent border-white hover:bg-gray-100 hover:text-gray-500 ml-2 w-1/4" href={APP_PAGES.LOGIN}>Authorize</Button>
              </div>
            )}

            <label className={`block text-sm font-medium text-gray-700 ${errors.serviceId ? "text-red-600" : ""}`}>Service</label>
            <Controller
              name="serviceId"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <select
                    {...field}
                    disabled={isLoading}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.serviceId ? "border-red-600 placeholder:text-red-600" : ""}`}
                  >
                    <option value="">Select a service</option>
                    {services?.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.fullName}
                      </option>
                    ))}
                  </select>
                  {errors.serviceId && <p className="text-sm text-red-600 mt-2">{errors.serviceId.message}</p>}
                  <p className="text-xs text-gray-500 mt-2">Didn't found your service? You can request it <Link className="font-bold text-primary-600 hover:underline" href={APP_PAGES.REQUEST_YOUR_SERVICE}>here</Link></p>
                </div>
              )}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 ${errors.note ? "text-red-600" : ""}`}>Note</label>
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.note ? "border-red-600 placeholder:text-red-600 text-red-600" : ""}`}
                  placeholder="Enter a note"
                />
              )}
            />
            {errors.note && <p className="text-sm text-red-600 mt-2">{errors.note.message}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 ${errors.price ? "text-red-600" : ""}`}>Price</label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  step="0.01"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.price ? "border-red-600 placeholder:text-red-600 text-red-600" : ""}`}
                  placeholder="Enter price"
                />
              )}
            />
            {errors.price && <p className="text-sm text-red-600 mt-2">{errors.price.message}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 ${errors.nextPaymentAt ? "text-red-600" : ""}`}>Date of next payment</label>
            <Controller
              name="nextPaymentAt"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.nextPaymentAt ? "border-red-600 placeholder:text-red-600 text-red-600" : ""}`}
                  placeholder="Enter date"
                />
              )}
            />
            {errors.nextPaymentAt && <p className="text-sm text-red-600 mt-2">{errors.nextPaymentAt.message}</p>}
          </div>

          <div className="flex items-center">
            <Controller
              name="isNotifying"
              control={control}
              disabled={!isAuthorized}
              render={({ field }) => (
                <label className="flex items-center">
                  <Checkbox
                    className="form-checkbox h-5 w-5 text-indigo-600"
                    {...field}
                    checked={field.value}
                    disabled={!isAuthorized}
                    value={field.value ? "true" : ""}
                  />
                  <span className={`ml-2 text-sm ${isAuthorized ? "text-gray-600" : "text-gray-400"}`}>Notify about upcoming payments</span>
                </label>
              )}
            />
          </div>

          <div className={`flex ${initialData ? "justify-between" : "justify-end"}`}>
            {initialData && (
              <Button color="red" isProcessing={isDeletingLoading} onClick={handleDeleteSubscription}>
                Delete
              </Button>
            )}
            <div className="flex space-x-3">
              <Button color="gray" onClick={closeAndClearForm}>Cancel</Button>
              <Button type="submit" isProcessing={isCreationLoading || isUpdatingLoading}>Save</Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
