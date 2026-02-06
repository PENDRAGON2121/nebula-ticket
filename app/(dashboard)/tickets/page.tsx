import { columns } from "./columns"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getTickets } from "@/app/actions/tickets"
import { auth } from "@/lib/auth"
import { canEditTicket, canDeleteTicket } from "@/lib/permissions"
import { DataTable } from "./data-table"

export default async function TicketsPage() {
  const session = await auth()
  const [data, canEdit, canDelete] = await Promise.all([
    getTickets({}),
    canEditTicket(),
    canDeleteTicket(),
  ])
  // Filtros de ejemplo, en integración real se obtendrían de searchParams
  const filters = { assignedToMe: false, estado: "", prioridad: "", search: "" }
  // Enriquecer data con permisos y asignación
  const userId = session?.user?.id
  const tableData = data.map(ticket => ({
    ...ticket,
    isMine: ticket.asignadoA?.id === userId,
    canEdit,
    canDelete,
    asignadoA: ticket.asignadoA
      ? {
          id: ticket.asignadoA.id,
          name: ticket.asignadoA.name,
          image: ticket.asignadoA.image ?? "",
          email: ticket.asignadoA.email ?? ""
        }
      : null,
    creadoPor: ticket.creadoPor
      ? {
          id: ticket.creadoPor.id,
          name: ticket.creadoPor.name,
          image: ticket.creadoPor.image ?? ""
        }
      : null,
  }))
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets de Soporte</h1>
          <p className="text-muted-foreground">Gestiona y asigna incidencias técnicas.</p>
        </div>
        <Button asChild>
          <Link href="/tickets/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Ticket
          </Link>
        </Button>
      </div>
      <Card className="flex-1">
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Listado de Incidencias</CardTitle>
          <CardDescription>
            Vista global de tickets activos e históricos.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-4">
            <DataTable columns={columns} data={tableData} filters={filters} onFiltersChange={() => {}} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
