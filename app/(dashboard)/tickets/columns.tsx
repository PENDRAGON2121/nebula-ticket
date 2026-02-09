"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2, UserCheck } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import Link from "next/link"

// This type is roughly what we expect from Prisma, including relations
export type TicketWithRelations = {
  id: string
  titulo: string
  status: "ABIERTO" | "EN_PROGRESO" | "ESPERA_CLIENTE" | "RESUELTO" | "CERRADO"
  prioridad: "BAJA" | "MEDIA" | "ALTA" | "CRITICA"
  asignadoA: {
    name: string | null
    image: string | null
    email: string
  } | null
  asignadoAId: string | null
  creadoPor: {
    name: string | null
    image: string | null
  } | null
  createdAt: Date
  onDelete?: (id: string) => void
}

export const columns: ColumnDef<TicketWithRelations & { isMine?: boolean; canEdit?: boolean; canDelete?: boolean; createdAt: Date }>[] = [
  {
    accessorKey: "titulo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium ml-4">{row.getValue("titulo")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
      
      switch (status) {
        case "ABIERTO": variant = "default"; break
        case "EN_PROGRESO": variant = "secondary"; break
        case "ESPERA_CLIENTE": variant = "destructive"; break
        case "RESUELTO": variant = "outline"; break
        case "CERRADO": variant = "outline"; break
      }

      return <Badge variant={variant}>{status.replaceAll("_", " ")}</Badge>
    },
  },
  {
    accessorKey: "prioridad",
    header: "Prioridad",
    cell: ({ row }) => {
      const priority = row.getValue("prioridad") as string
      return (
        <div className="flex items-center">
            {priority === "CRITICA" && <span className="mr-2 text-red-500">!!!</span>}
            <span className={priority === "ALTA" || priority === "CRITICA" ? "font-bold text-destructive" : ""}>
                {priority}
            </span>
        </div>
      )
    },
  },
  {
    accessorKey: "asignadoA",
    header: "Asignado",
    cell: ({ row }) => {
      const user = row.original.asignadoA
      const isMine = row.original.isMine
      if (!user) return <span className="text-muted-foreground text-sm">Sin asignar</span>
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.slice(0,2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{user.name || user.email}</span>
          {isMine && <Badge variant="secondary" className="ml-2"><UserCheck className="w-3 h-3 mr-1" />Asignado a mí</Badge>}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(ticket.id)}>
              Copiar ID del Ticket
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={`/tickets/${ticket.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalles
                </Link>
            </DropdownMenuItem>
            {ticket.canEdit && (
              <DropdownMenuItem asChild>
                <Link href={`/tickets/${ticket.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />Editar
                </Link>
              </DropdownMenuItem>
            )}
            {ticket.canDelete && (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  if (confirm("¿Seguro que deseas eliminar este ticket?")) {
                    ticket.onDelete?.(ticket.id)
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />Eliminar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
