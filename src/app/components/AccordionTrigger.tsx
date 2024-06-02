import React from 'react'
import * as Accordion from "@radix-ui/react-accordion";

export default function AccordionTrigger({ label }: { label: string }) {
  return (
    <Accordion.Trigger className="bg-gradient-to-tr from-blue-950 to-blue-900 items-center justify-between p-5 w-full text-white">
      {label}
    </Accordion.Trigger>
  )
}
