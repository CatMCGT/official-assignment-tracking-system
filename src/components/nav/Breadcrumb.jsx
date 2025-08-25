"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Icon from "../Icon";
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Breadcrumb() {
  const pathname = usePathname()
  const [prev, setPrev] = useState(pathname.split("/")[2])
  const [next, setNext] = useState("")

  return (
    <div className="flex flex-row gap-4 items-center">
      <button>
        <Icon tooltip="Previous" border={false}>
          <ChevronLeftIcon className={clsx(
            "size-6",
            prev ? "text-text-strong" : "text-text-weakest"
          )}/>
        </Icon>
      </button>

      <button>
        <Icon tooltip="Next" border={false}>
          <ChevronRightIcon className={clsx(
            "size-6",
            next ? "text-text-strong" : "text-text-weakest"
          )}/>
        </Icon>
      </button>

      <p className="text-text-weaker tracking-wide">{pathname}</p>
    </div>
  )
}