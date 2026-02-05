"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { updateTicketStatus, updateTicketPriority } from "@/app/actions/ticket-details"
import { TicketStatus, TicketPriority } from "@prisma/client"

interface TicketStatusSelectorProps {
  ticketId: string
  status: TicketStatus
}

export function TicketStatusSelector({ ticketId, status }: TicketStatusSelectorProps) {
  const [isPending, startTransition] = useTransition()
  const [localStatus, setLocalStatus] = useState<TicketStatus>(status)

  const handleValueChange = (value: string) => {
    const newStatus = value as TicketStatus
    setLocalStatus(newStatus)
    startTransition(async () => {
      const result = await updateTicketStatus(ticketId, newStatus)
      if (result.error) {
        // Revert on error (optional, but good practice)
        setLocalStatus(status)
      }
    })
  }

  return (
    <Select value={localStatus} onValueChange={handleValueChange} disabled={isPending}>
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
  const [localPriority, setLocalPriority] = useState<TicketPriority>(priority)

  const handleValueChange = (value: string) => {
    const newPriority = value as TicketPriority
    setLocalPriority(newPriority)
    startTransition(async () => {
      const result = await updateTicketPriority(ticketId, newPriority)
      if (result.error) {
         setLocalPriority(priority)
      }
    })
  }

  return (
    <Select value={localPriority} onValueChange={handleValueChange} disabled={isPending}>
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
