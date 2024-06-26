"use client"

import Loader from '@/components/ui/Loader';
import { APP_PAGES } from '@/config/pages-url.config';
import { useProfile } from '@/hooks/useProfile';
import { requestService } from '@/services/request-service.service';
import { RequestedServiceFormInput } from '@/types/requested-service.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name of serive is too short, at least 2 characters required")
    .max(255, "Name of serive is too long, maximum 255 characters")
    .required("Enter please name of service"),
  url: yup
    .string()
    .url("Enter please valid URL of service")
    .required("Please enter the URL of the service"),
});

export default function RequestService() {
  const { push } = useRouter()

  const { data, isLoading: isProfileLoading } = useProfile();

  const { handleSubmit, control, formState: { errors }, clearErrors, setError } = useForm<RequestedServiceFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      url: '',
    }
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationKey: ['requested-service'],
    mutationFn: async (data: RequestedServiceFormInput) => requestService.createRequestSerice(data),
    onSuccess() {
      toast.success('Successfully requested your service!', {
        position: 'bottom-center',
        duration: 3000,
      })

      push(APP_PAGES.SUBSCRIPTIONS)
    },
    onError(error: any) {
      clearErrors()

      toast.error("Failed to request your service!", {
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

      // check if error from yup front-end validation
      if (error?.response?.data) {
        setError(error?.response?.data?.type, {
          type: "manual",
          message: error?.response?.data?.message,
        });
      }
    },
  })

  const onSubmit: SubmitHandler<RequestedServiceFormInput> = (data: RequestedServiceFormInput) => {
    mutate(data);
  };

  const isAuthorized = useMemo(() => (
    Boolean(data && !isProfileLoading)
  ), [data, isProfileLoading]);

  if (isProfileLoading) {
    return <Loader />
  }

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {isAuthorized ? (
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-700 md:text-2xl">
                Request your service
              </h1>
              <h3 className="text-base text-gray-400 !mt-2">If you didn't find service, you can request it here and we will it</h3>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label className={`block mb-2 text-sm font-medium text-gray-700 ${errors.name ? "text-red-600" : ""}`}>Service Name</label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.name ? "border-red-600 placeholder:text-red-600 text-red-600" : ""}`}
                        placeholder="Enter name of service"
                      />
                    )}
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-2">{errors.name.message}</p>}
                </div>

                <div>
                  <label className={`block mb-2 text-sm font-medium text-gray-700 ${errors.url ? "text-red-600" : ""}`}>Service URL</label>
                  <Controller
                    name="url"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="url"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.url ? "border-red-600 placeholder:text-red-600 text-red-600" : ""}`}
                        placeholder="Enter URL of service"
                      />
                    )}
                  />
                  {errors.url && <p className="text-sm text-red-600 mt-2">{errors.url.message}</p>}
                </div>

                <Button type="submit" isProcessing={isLoading} className="w-full">Request Service</Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center h-dvh w-3/4 items-center">
            <h1 className="text-2xl font-bold mb-2">You not logined yet</h1>
            <p className="text-gray-500 mb-6 text-center">If you want to request service, you need to login so you will track status in your <Link className="font-bold text-primary-600 hover:underline" href={APP_PAGES.PROFILE}>Profile</Link></p>
            <div className="flex space-x-4">
              <Button as={Link} className="flex items-center px-4 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700" href={APP_PAGES.LOGIN}>Authorize</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
