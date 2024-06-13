"use client"

import { Metadata } from "next"

import { SITE_NAME } from "@/constants/seo.constants"
import RequestService from "./RequestService"

export const metadata: Metadata = {
  title: `Request new service | ${SITE_NAME}`,
  description: "Here you can request a service which you didn't find in our list."
}

export default function RequestServicePage() {
  return <RequestService />
}
