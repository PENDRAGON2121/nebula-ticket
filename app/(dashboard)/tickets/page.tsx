import { columns } from "./columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Ticket, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"
import { DataTableClient } from "./data-table-client"
import { getTickets } from "@/app/actions/tickets"
import { auth } from "@/lib/auth"
import { canEditTicket, canDeleteTicket, canViewAllTickets } from "@/lib/permissions"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const statusLabels: Record<string, string> = {
  ABIERTO: "Abierto",
  EN_PROGRESO: "En Progreso",
  ESPERA_CLIENTE: "Espera Cliente",
  RESUELTO: "Resuelto",
  CERRADO: "Cerrado",
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ABIERTO: "default",
  EN_PROGRESO: "secondary",
  ESPERA_CLIENTE: "destructive",
  RESUELTO: "outline",
  CERRADO: "outline",
}

const priorityVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  BAJA: "outline",
  MEDIA: "secondary",
  ALTA: "destructive",
  CRITICA: "destructive",
}

export default async function TicketsPage() {
  const [session, tickets, isAdminOrAgent] = await Promise.all([
    auth(),
    getTickets({}),
    canViewAllTickets(),
  ])

  // --- VISTA SIMPLIFICADA PARA USUARIO ---
  if (!isAdminOrAgent) {
    return (
      <div className="flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mis Tickets</h1>
            <p className="text-muted-foreground">Consulta el estado de tus solicitudes o crea una nueva.</p>
          </div>
          <Button asChild>
            <Link href="/tickets/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ticket
            </Link>
          </Button>
        </div>

        {tickets.length === 0 ? (
          <Card className="flex-1">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No tienes tickets</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Crea tu primer ticket para solicitar soporte.
              </p>
              <Button asChild>
                <Link href="/tickets/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Ticket
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {tickets.map((ticket) => (
              <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">{ticket.titulo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: es })}
                        </span>
                        <span>•</span>
                        <span>#{ticket.id.slice(-6)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={priorityVariant[ticket.prioridad] || "secondary"}>
                        {ticket.prioridad}
                      </Badge>
                      <Badge variant={statusVariant[ticket.status] || "outline"}>
                        {statusLabels[ticket.status] || ticket.status}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  // --- VISTA COMPLETA PARA ADMIN/AGENTE ---
  const [canEdit, canDelete] = await Promise.all([
    canEditTicket(),
    canDeleteTicket(),
  ])

  const data = tickets.map((ticket) => ({
    ...ticket,
    isMine: ticket.asignadoAId === session?.user?.id,
    canEdit,
    canDelete,
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
            <DataTableClient columns={columns} data={data} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
