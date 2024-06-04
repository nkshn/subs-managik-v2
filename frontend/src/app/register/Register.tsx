"use client"

import { APP_PAGES } from '@/config/pages-url.config';
import { authService } from '@/services/auth.service';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from 'flowbite-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

type RegisterFormInputs = {
  name: string;
  email: string;
  phone: string;
  password: string;
  repeatPassword: string;
};

const schema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Your name must be realistic, so it must be longer than 2 symbols")
    .max(255, "Your name must be realistic, so it must be shorter than 255 symbols")
    .required("Please provide your name"),
  email: yup
    .string()
    .email("Please provide a valid email address")
    .required("Please provide your email address"),
  phone: yup
    .string()
    .required("Please provide your phone number")
    .test('is-valid-phone-number', 'Please provide a valid phone number with country code', (value) => {
      const phone = parsePhoneNumberFromString(value || '');
      return phone ? phone.isValid() : false;
    }),
  password: yup
    .string()
    .min(8, "Password must be longer that 8 characters")
    .required("Password must be provided"),
  repeatPassword: yup
    .string()
    .required("Confirm password must be provided")
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export default function Register() {
  const { push } = useRouter()
  const queryClient = useQueryClient()

  const { handleSubmit, control, formState: { errors }, reset, setError, clearErrors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      repeatPassword: '',
    },
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationKey: ['register'],
    mutationFn: async (data: RegisterFormInputs) => authService.register(data),
    onSuccess() {
      toast.success('Successfully created new account!', {
        position: 'bottom-center',
        duration: 3000,
      })

      reset()
      push(APP_PAGES.SUBSCRIPTIONS)

      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError(error: any) {
      clearErrors()

      toast.error("Failed to create new account!", {
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

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data: RegisterFormInputs) => {
    mutate(data)
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-700 md:text-2xl">
              Create an new account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className={`block mb-2 text-sm font-medium text-gray-700 dark:text-white ${errors.name ? "text-red-600" : ""}`}>Your name</label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      name="name"
                      maxLength={255}
                      className={`bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.name ? "border-red-600 text-red-600" : ""}`}
                      placeholder="Enter your name"
                    />
                  )}
                />
                {errors.name && <p className="text-sm text-red-600 mt-2">{errors.name.message}</p>}
              </div>

              <div>
                <label className={`block mb-2 text-sm font-medium text-gray-700 ${errors.email ? "text-red-600" : ""}`}>Your email</label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      className={`bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.email ? "border-red-600 text-red-600" : ""}`}
                      placeholder="Enter your email"
                    />
                  )}
                />
                {errors.email && <p className="text-sm text-red-600 mt-2">{errors.email.message}</p>}
              </div>

              <div>
                <label className={`block mb-2 text-sm font-medium text-gray-700 ${errors.phone ? "text-red-600" : ""}`}>Your phone number</label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.phone ? "border-red-600 text-red-600" : ""}`}
                      placeholder="Enter your phone number"
                    />
                  )}
                />
                {errors.phone && <p className="text-sm text-red-600 mt-2">{errors.phone.message}</p>}
              </div>

              <div>
                <label className={`block mb-2 text-sm font-medium text-gray-700 ${errors.password ? "text-red-600" : ""}`}>Your password</label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      className={`bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.password ? "border-red-600 text-red-600" : ""}`}
                      placeholder="Enter your password"
                    />
                  )}
                />
                {errors.password && <p className="text-sm text-red-600 mt-2">{errors.password.message}</p>}
              </div>

              <div>
                <label className={`block mb-2 text-sm font-medium text-gray-700 ${errors.repeatPassword ? "text-red-600" : ""}`}>Confirm password</label>
                <Controller
                  name="repeatPassword"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      placeholder="Confirm password"
                      className={`bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.repeatPassword ? "border-red-600 text-red-600" : ""}`}
                    />
                  )}
                />
                {errors.repeatPassword && <p className="text-sm text-red-600 mt-2">{errors.repeatPassword.message}</p>}
              </div>

              <Button type="submit" isProcessing={isLoading} className="w-full">Create an account</Button>

              <p className="text-sm font-light text-gray-500">
                Already have an account?  <Link href={APP_PAGES.LOGIN} className="font-medium text-primary-600 hover:underline">Login here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
