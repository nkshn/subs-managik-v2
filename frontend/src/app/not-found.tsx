import type { Metadata } from "next"

import { NO_INDEX_PAGE } from "@/constants/seo.constants"

export const metedata: Metadata = {
  title: "404 | Not Found",
  ...NO_INDEX_PAGE
}

export default function NotFound() {
  return (
    <div className="grid h-screen place-content-center bg-white px-4 text-lg">
      <h3>404 | Not Found</h3>
    </div>
  )
}
