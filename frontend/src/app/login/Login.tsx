"use client"

import { APP_PAGES } from '@/config/pages-url.config';
import { authService } from '@/services/auth.service';
import { LoginFormInputs } from '@/types/auth.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please provide a valid email address")
    .required("Please provide your email address"),
  password: yup
    .string()
    .min(8, "Password must be longer that 8 characters")
    .required("Password must be provided"),
});

export default function Login() {
  const { push } = useRouter()
  const queryClient = useQueryClient()

  const { handleSubmit, control, formState: { errors }, reset, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: LoginFormInputs) => authService.login(data),
    onSuccess() {
      toast.success('Successfully login to your account!', {
        position: 'bottom-center',
        duration: 3000,
      })

      reset()
      push(APP_PAGES.SUBSCRIPTIONS)

      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError(error: any) {
      toast.error("Failed to login to your account!", {
        position: 'bottom-center',
        duration: 3000,
      })

      // check if errors from server
      if(typeof error?.response?.data?.message === "object" && error?.response?.data?.message?.length > 0) {
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

  const onSubmit: SubmitHandler<LoginFormInputs> = (data: LoginFormInputs) => {
    mutate(data)
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-700 md:text-2xl">
              Login to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className={`block mb-2 text-sm font-medium text-gray-700 ${errors.email ? "text-red-600" : ""}`}>Your email</label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      className={`bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.email ? "border-red-600 text-red-600 placeholder:text-red-600" : ""}`}
                      placeholder="Enter your email"
                    />
                  )}
                />
                {errors.email && <p className="text-sm text-red-600 mt-2">{errors.email.message}</p>}
              </div>

              <div>
                <label className={`block mb-2 text-sm font-medium text-gray-700 ${errors.password ? "text-sm text-red-600" : ""}`}>Your password</label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      className={`bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.password ? "border-red-600 text-red-600 placeholder:text-red-600" : ""}`}
                      placeholder="Enter your password"
                    />
                  )}
                />
                {errors.password && <p className="text-sm text-red-600 mt-2">{errors.password.message}</p>}
              </div>

              <Button type="submit" isProcessing={isLoading} className="w-full">Login to your account</Button>

              <p className="text-sm font-light text-gray-500">
                Dont have an account?  <Link href={APP_PAGES.REGISTER} className="font-medium text-primary-600 hover:underline">Register here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
