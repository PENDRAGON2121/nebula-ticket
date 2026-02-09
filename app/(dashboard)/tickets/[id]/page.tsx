import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CommentList } from "@/components/tickets/comment-list"
import { CommentForm } from "@/components/tickets/comment-form"
import { TicketStatusSelector, TicketPrioritySelector } from "@/components/tickets/ticket-controls"
import { Laptop, User, Calendar, AlertCircle } from "lucide-react"
import { getTicketHistory } from "@/app/actions/ticket-history"
import { canEditTicket, canDeleteTicket, canViewInternalComments, canViewAllTickets } from "@/lib/permissions"
import { TicketHistory } from "@/components/tickets/ticket-history"

interface TicketPageProps {
  params: {
    id: string
  }
}

async function getTicket(id: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  const ticket = await prisma.ticket.findUnique({
    where: { id, deletedAt: null },
    include: {
      activo: true,
      creadoPor: true,
      asignadoA: true,
      comentarios: {
        include: {
          autor: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  })

  if (!ticket) return null

  // Verificar permisos: admin/agente ven todos, usuario solo los suyos
  const isAdminOrAgent = await canViewAllTickets()
  if (!isAdminOrAgent && ticket.creadoPorId !== session.user.id) {
    return null // Dispara notFound()
  }

  return ticket
}

export default async function TicketDetailPage({ params }: TicketPageProps) {
  const { id } = params
  const [ticket, history, canEdit, canDelete, canViewInternal] = await Promise.all([
    getTicket(id),
    getTicketHistory(id),
    canEditTicket(),
    canDeleteTicket(),
    canViewInternalComments(),
  ])
  if (!ticket) {
    notFound()
  }
  // Convertir createdAt a string para el componente TicketHistory
  const historyForComponent = history.map(h => ({
    ...h,
    createdAt: h.createdAt instanceof Date ? h.createdAt.toISOString() : h.createdAt,
  }))
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Main Content: Details & Comments */}
      <div className="md:col-span-2 space-y-6">
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{ticket.titulo}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>#{ticket.id.slice(-6)}</span>
                <span>•</span>
                <span>Abierto por {ticket.creadoPor?.name}</span>
                <span>•</span>
                <span>{format(new Date(ticket.createdAt), "PPP p", { locale: es })}</span>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Descripción</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {ticket.descripcion}
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actividad</CardTitle>
            <CardDescription>Comentarios y actualizaciones del caso.</CardDescription>
          </CardHeader>
          <CardContent>
            <CommentList comments={ticket.comentarios} canViewInternal={canViewInternal} />
            <Separator className="my-6" />
            <CommentForm ticketId={ticket.id} canViewInternal={canViewInternal} />
            <Separator className="my-6" />
            <TicketHistory history={historyForComponent} />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar: Metadata & Controls */}
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Estado y Prioridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Estado Actual</span>
                    <TicketStatusSelector ticketId={ticket.id} status={ticket.status} />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Prioridad</span>
                    <TicketPrioritySelector ticketId={ticket.id} priority={ticket.prioridad} />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Detalles del Activo</CardTitle>
            </CardHeader>
            <CardContent>
                {ticket.activo ? (
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-muted rounded-md">
                            <Laptop className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-sm">{ticket.activo.nombre}</p>
                            <p className="text-xs text-muted-foreground">S/N: {ticket.activo.serial || "N/A"}</p>
                            <p className="text-xs text-muted-foreground">Placa: {ticket.activo.codigoInterno}</p>
                            <Badge variant="outline" className="mt-1 text-[10px]">{ticket.activo.estado}</Badge>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Sin activo vinculado
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
             <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Asignado A</CardTitle>
            </CardHeader>
            <CardContent>
                {ticket.asignadoA ? (
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={ticket.asignadoA.image || ""} />
                            <AvatarFallback>{ticket.asignadoA.name?.slice(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                            <span className="font-medium text-sm">{ticket.asignadoA.name}</span>
                            <span className="text-xs text-muted-foreground">{ticket.asignadoA.email}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">
                        Sin técnico asignado
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
