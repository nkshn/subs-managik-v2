import type { Metadata } from "next"

import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants"
import Register from "./Register"

export const metedata: Metadata = {
  title: `Create an new account | ${SITE_NAME}`,
  ...NO_INDEX_PAGE
}

export default function RegisterPage() {
  return <Register />
}
