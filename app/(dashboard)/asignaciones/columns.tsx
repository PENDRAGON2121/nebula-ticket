"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Badge } from "@/components/ui/badge"
import { AgentAssigner } from "@/components/asignaciones/agent-assigner"

// We need to pass the list of agents to the columns, or the cell renderer.
// TanStack table allows passing meta or context, but usually it's easier to 
// create the columns inside the component or pass props to a custom cell.
// For simplicity here, we'll define the columns factory function.

export type TicketRow = {
  id: string
  titulo: string
  prioridad: string
  createdAt: Date
  creadoPor: {
    name: string | null
    email: string
  } | null
}

export const getColumns = (agents: any[]): ColumnDef<TicketRow>[] => [
  {
    accessorKey: "titulo",
    header: "Asunto",
    cell: ({ row }) => <span className="font-medium">{row.getValue("titulo")}</span>,
  },
  {
    accessorKey: "prioridad",
    header: "Prioridad",
    cell: ({ row }) => {
        const priority = row.getValue("prioridad") as string
        return (
            <Badge variant={priority === "CRITICA" || priority === "ALTA" ? "destructive" : "secondary"}>
                {priority}
            </Badge>
        )
    },
  },
  {
    accessorKey: "creadoPor.name",
    header: "Reportado Por",
    cell: ({ row }) => {
        const creator = row.original.creadoPor
        return (
            <div className="flex flex-col">
                <span>{creator?.name || "Desconocido"}</span>
                <span className="text-xs text-muted-foreground">{creator?.email}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => {
        return format(new Date(row.getValue("createdAt")), "PP p", { locale: es })
    },
  },
  {
    id: "actions",
    header: "Asignar A",
    cell: ({ row }) => {
      return (
        <AgentAssigner ticketId={row.original.id} agents={agents} />
      )
    },
  },
]
