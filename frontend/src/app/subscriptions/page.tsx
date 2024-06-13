"use client"

import { Metadata } from "next"

import { SITE_NAME } from "@/constants/seo.constants"
import Subscriptions from "./Subscriptions"

export const metadata: Metadata = {
  title: `Subscriptions | ${SITE_NAME}`,
  description: "Here list of all your subscriptions"
}

export default function SubscriptionsPage() {
  return <Subscriptions />
}
