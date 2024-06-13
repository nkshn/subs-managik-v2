import type { Metadata } from "next"

import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants"
import Login from "./Login"

export const metadata: Metadata = {
  title: `Login to existing account | ${SITE_NAME}`,
  ...NO_INDEX_PAGE
}

export default function LoginPage() {
  return <Login />
}
