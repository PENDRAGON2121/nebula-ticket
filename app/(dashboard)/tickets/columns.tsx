"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Eye, Pencil } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  creadoPor: {
    name: string | null
    image: string | null
  } | null
  createdAt: Date
}

export const columns: ColumnDef<TicketWithRelations>[] = [
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
        case "ABIERTO": variant = "default"; break; // Black
        case "EN_PROGRESO": variant = "secondary"; break; // Gray
        case "RESUELTO": variant = "outline"; break; // White/Border
        case "CRITICA": variant = "destructive"; break; // Red
      }

      return <Badge variant={variant}>{status.replace("_", " ")}</Badge>
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
      if (!user) return <span className="text-muted-foreground text-sm">Sin asignar</span>
      
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.slice(0,2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{user.name || user.email}</span>
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
            <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Editar estado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
