"use client"

import Loader from "@/components/ui/Loader";
import { APP_PAGES } from "@/config/pages-url.config";
import { useLogout } from "@/hooks/useLogout";
import { useProfile } from "@/hooks/useProfile";
import { userService } from "@/services/user.service";
import { ProfileFormInputs } from "@/types/user.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "flowbite-react";
import parsePhoneNumberFromString from "libphonenumber-js";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from 'yup';

const validationSchema = yup.object().shape({
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
    .test(
      'password',
      'Password must be at least 8 characters',
      value => !value || value.length === 0 || value.length >= 8
    ),
});

export default function Profile() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: profile, isLoading: isProfileLoading } = useProfile()

  const { mutate: logoutMutation, isLoading: isLogoutLoading } = useLogout()

  const { control, handleSubmit, formState: { errors }, reset, clearErrors, setError } = useForm<ProfileFormInputs>({
    resolver: yupResolver(validationSchema),
    values: {
      name: profile?.user?.name || '',
      email: profile?.user?.email || '',
      phone: profile?.user?.phone || '',
      password: '',
    }
  });

  const { mutate: updateProfileMutation, isPending: isUpdateProfileLoading } = useMutation({
    mutationKey: ['update-profile'],
    mutationFn: async (data: ProfileFormInputs) => userService.updateProfile(data),
    onSuccess() {
      toast.success('Successfully updated profile!', {
        position: 'bottom-center',
        duration: 3000,
      })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError(error: any) {
      clearErrors()

      toast.error("Failed to updated new account!", {
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

  const onSubmit: SubmitHandler<ProfileFormInputs> = (data: ProfileFormInputs) => {
    const { password, ...rest } = data

    updateProfileMutation({
      ...rest,
      password: password || undefined,
    })
  };

  const restoreOldValues = () => {
    reset({
      name: profile?.user?.name || '',
      email: profile?.user?.email || '',
      phone: profile?.user?.phone || '',
      password: '',
    })
  }

  const handleLogout = () => {
    logoutMutation()

    router.push(APP_PAGES.LOGIN)
  }

  if (isProfileLoading) {
    return <Loader />
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col">
        <h4 className="text-gray-500 font-bold text-lg mb-4">Your user statistics</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-base font-semibold">Total Requested Services</h3>
            <p className="mt-2 text-2xl">{profile?.stats?.totalRequestedSerices || 0}</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-base font-semibold">Total Revenue</h3>
            <p className="mt-2 text-2xl">{profile?.stats?.totalRevenue || 0}$</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-base font-semibold">Total Subscriptions</h3>
            <p className="mt-2 text-2xl">{profile?.stats?.totalSubscriptions || 0}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-10">
        <h4 className="text-gray-500 font-bold text-lg">Update user profile info</h4>
        <div>
          <label className={`block mb-2 text-sm font-medium text-gray-700 ${errors.name ? "text-red-600" : ""}`}>Your Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter your name"
                className={`bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.name ? "border-red-600 text-red-600" : ""}`}
              />
            )}
          />
          {errors.name && <p className="text-sm text-red-600 mt-2">{errors.name.message}</p>}
        </div>

        <div>
          <label className={`block mb-2 text-sm font-medium text-gray-700 ${errors.email ? "text-red-600" : ""}`}>Your Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Enter your email address"
                className={`bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.email ? "border-red-600 text-red-600" : ""}`}
              />
            )}
          />
          {errors.email && <p className="text-sm text-red-600 mt-2">{errors.email.message}</p>}
        </div>

        <div>
          <label className={`block mb-2 text-sm font-medium text-gray-700 ${errors.phone ? "text-red-600" : ""}`}>Your Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter your phone number"
                className={`bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.phone ? "border-red-600 text-red-600" : ""}`}
              />
            )}
          />
          {errors.phone && <p className="text-sm text-red-600 mt-2">{errors.phone.message}</p>}
        </div>

        <div>
          <label className={`block mb-2 text-sm font-medium text-gray-700 ${errors.password ? "text-red-600" : ""}`}>Your Password</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                placeholder="************"
                className={`bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.password ? "border-red-600 text-red-600" : ""}`}
              />
            )}
          />
          {errors.password && <p className="text-sm text-red-600 mt-2">{errors.password.message}</p>}
        </div>

        <div className="flex flex-row justify-between">
          <Button color="gray" outline onClick={restoreOldValues}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Restore
          </Button>

          <div className="flex justify-end gap-3">
            <Button color="red" isProcessing={isLogoutLoading} onClick={handleLogout} className="w-28">Logout</Button>
            <Button type="submit" isProcessing={isUpdateProfileLoading} className="w-28">Save</Button>
          </div>
        </div>

      </form>
    </div>
  )
}
