import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Button, Checkbox } from "flowbite-react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Subscription, SubscriptionFormInputs } from "@/types/subscription.types";
import Link from "next/link";
import { APP_PAGES } from "@/config/pages-url.config";
import { Info } from "lucide-react";
import { useServices } from "@/hooks/useServices";

interface SubscriptionModalProps {
  isOpen: boolean;
  initialData: Subscription;
  onClose: () => void;
  onAddOrEditSubmit: (data: SubscriptionFormInputs) => void;
  onDelete?: (data: Subscription) => void | null;
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
  onAddOrEditSubmit,
  onDelete,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubscriptionFormInputs>({
    resolver: yupResolver<SubscriptionFormInputs>(validationSchema),
    values: {
      serviceId: initialData?.service?.id || "",
      note: initialData?.note || "",
      price: initialData?.price || 0,
      nextPaymentAt: initialData?.nextPaymentAt ? initialData.nextPaymentAt.split("T")[0] : "",
      isNotifying: initialData?.isNotifying || false,
    },
    defaultValues: {
      serviceId: initialData?.service?.id || "",
      note: initialData?.note || "",
      price: initialData?.price || 0,
      nextPaymentAt: initialData?.nextPaymentAt ? initialData.nextPaymentAt.split("T")[0] : "",
      isNotifying: initialData?.isNotifying || false,
    },
  });

  const { data: services, isLoading } = useServices()

  const handleFormSubmit = (data: SubscriptionFormInputs) => {
    console.log("modal window submit data: ", data);
    onAddOrEditSubmit(data);
    reset();
    onClose();
  };

  const handleDeleteSubscription = () => {
    console.log("detete subscription, initialData", initialData);
    if (onDelete) {
      onDelete(initialData);
      onClose();
    }
  }

  const closeAndClearForm = () => {
    reset();
    onClose();
  }

  const isAuth = false

  return (
    <Modal show={isOpen} onClose={closeAndClearForm}>
      <Modal.Header>{initialData ? "Edit Subscription" : "Add Subscription"}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
          {!isAuth && (
            <div className="mx-auto flex gap-5 flex-col mb-5 border-blue-500 border-solid border-2 items-center bg-blue-300 p-4 rounded-md">
              <div className="flex flex-row gap-3">
                <Info color="white"/>
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
              disabled={!isAuth}
              render={({ field }) => (
                <label className="flex items-center">
                  <Checkbox
                    className="form-checkbox h-5 w-5 text-indigo-600"
                    {...field}
                    disabled={!isAuth}
                  />
                  <span className={`ml-2 text-sm ${isAuth ? "text-gray-600" : "text-gray-400"}`}>Notify about upcoming payments</span>
                </label>
              )}
            />
          </div>



          <div className={`flex ${onDelete ? "justify-between" : "justify-end"}`}>
            {onDelete && (
              <Button color="red" onClick={handleDeleteSubscription}>
                Delete
              </Button>
            )}
            <div className="flex space-x-3">
              <Button color="gray" onClick={closeAndClearForm}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
