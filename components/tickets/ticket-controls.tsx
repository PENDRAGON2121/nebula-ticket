"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateTicketStatus, updateTicketPriority } from "@/app/actions/ticket-details"
import { TicketStatus, TicketPriority } from "@prisma/client"
import { useTransition } from "react"
import { Badge } from "@/components/ui/badge"

interface TicketStatusSelectorProps {
  ticketId: string
  status: TicketStatus
}

export function TicketStatusSelector({ ticketId, status }: TicketStatusSelectorProps) {
  const [isPending, startTransition] = useTransition()

  const handleValueChange = (value: string) => {
    startTransition(async () => {
      await updateTicketStatus(ticketId, value as TicketStatus)
    })
  }

  return (
    <Select defaultValue={status} onValueChange={handleValueChange} disabled={isPending}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ABIERTO">Abierto</SelectItem>
        <SelectItem value="EN_PROGRESO">En Progreso</SelectItem>
        <SelectItem value="ESPERA_CLIENTE">Espera Cliente</SelectItem>
        <SelectItem value="RESUELTO">Resuelto</SelectItem>
        <SelectItem value="CERRADO">Cerrado</SelectItem>
      </SelectContent>
    </Select>
  )
}

interface TicketPrioritySelectorProps {
  ticketId: string
  priority: TicketPriority
}

export function TicketPrioritySelector({ ticketId, priority }: TicketPrioritySelectorProps) {
  const [isPending, startTransition] = useTransition()

  const handleValueChange = (value: string) => {
    startTransition(async () => {
      await updateTicketPriority(ticketId, value as TicketPriority)
    })
  }

  return (
    <Select defaultValue={priority} onValueChange={handleValueChange} disabled={isPending}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Prioridad" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="BAJA">Baja</SelectItem>
        <SelectItem value="MEDIA">Media</SelectItem>
        <SelectItem value="ALTA">Alta</SelectItem>
        <SelectItem value="CRITICA">Crítica</SelectItem>
      </SelectContent>
    </Select>
  )
}
