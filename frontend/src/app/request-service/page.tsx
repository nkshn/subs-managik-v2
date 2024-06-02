"use client"

import { Metadata } from "next"

import { SITE_NAME } from "@/constants/seo.constants"
import RequestService from "./RequestService"

export const metedata: Metadata = {
  title: `Request new service | ${SITE_NAME}`,
  description: "Сторінка з усіма підписками користувачів"
}

export default function RequestServicePage() {
  return <RequestService />
}
