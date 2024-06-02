"use client"

import { Navbar as FlowbiteNavbar } from "flowbite-react"
import Link from "next/link"

import { APP_PAGES } from "@/config/pages-url.config"

export function Navbar() {
  return (
    <FlowbiteNavbar rounded className="m:px-0">
      <FlowbiteNavbar.Brand as={Link} href={APP_PAGES.HOME}>
        <span className="self-center whitespace-nowrap text-xl font-semibold">
          Sub-Managik
        </span>
      </FlowbiteNavbar.Brand>

      <FlowbiteNavbar.Toggle />

      <FlowbiteNavbar.Collapse>
        <FlowbiteNavbar.Link
          as={Link}
          href={APP_PAGES.HOME}
        >
          <p>Home</p>
        </FlowbiteNavbar.Link>

        <FlowbiteNavbar.Link
          as={Link}
          href={APP_PAGES.SUBSCRIPTIONS}
        >
          <p>Subscriptions</p>
        </FlowbiteNavbar.Link>

        <FlowbiteNavbar.Link
          as={Link}
          href={APP_PAGES.LOGIN}
        >
          <p>Login</p>
        </FlowbiteNavbar.Link>
      </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>
  )
}
