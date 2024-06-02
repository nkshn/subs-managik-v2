import type { Metadata } from "next"

import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants"
import Profile from "./Profile"

export const metedata: Metadata = {
  title: `Your Profile | ${SITE_NAME}`,
  ...NO_INDEX_PAGE
}

export default function ProfilePage() {
  return <Profile />
}
