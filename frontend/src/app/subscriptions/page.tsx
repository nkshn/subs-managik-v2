"use client"

import { Metadata } from "next"

import { SITE_NAME } from "@/constants/seo.constants"
import Subscriptions from "./Subscriptions"

export const metedata: Metadata = {
  title: `Subscriptions | ${SITE_NAME}`,
  description: "Сторінка з усіма підписками користувачів"
}

export default function SubscriptionsPage() {
  return <Subscriptions />
}
