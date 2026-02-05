import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Clock, CheckCircle, AlertCircle } from "lucide-react"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

async function getDashboardData() {
  const session = await auth()
  if (!session?.user?.id) return null

  // Execute independent queries in parallel
  const [
    openCount,
    inProgressCount,
    resolvedCount,
    criticalCount,
    recentActivity,
    myAssignments
  ] = await Promise.all([
    // 1. Open Tickets
    prisma.ticket.count({
      where: { status: "ABIERTO" }
    }),
    // 2. In Progress
    prisma.ticket.count({
      where: { status: "EN_PROGRESO" }
    }),
    // 3. Resolved (This Month)
    prisma.ticket.count({
      where: {
        status: { in: ["RESUELTO", "CERRADO"] },
        updatedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    // 4. Critical Tickets
    prisma.ticket.count({
      where: { status: "ABIERTO", prioridad: "CRITICA" }
    }),
    // 5. Recent Activity (Last 5 tickets created or updated)
    prisma.ticket.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: {
        creadoPor: { select: { name: true } },
        asignadoA: { select: { name: true } }
      }
    }),
    // 6. My Assignments
    prisma.ticket.findMany({
      where: {
        asignadoAId: session.user.id,
        status: { notIn: ["RESUELTO", "CERRADO"] }
      },
      take: 5,
      orderBy: { prioridad: "desc" } // Show Critical/High first
    })
  ])

  return {
    stats: {
      open: openCount,
      inProgress: inProgressCount,
      resolvedMonth: resolvedCount,
      critical: criticalCount
    },
    recentActivity,
    myAssignments
  }
}

export default async function Page() {
  const data = await getDashboardData()

  if (!data) return <div>No autorizado</div>

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tickets Abiertos
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.open}</div>
            <p className="text-xs text-muted-foreground">
              Total activos en cola
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En Progreso
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Siendo atendidos ahora
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resueltos (Mes)
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.resolvedMonth}</div>
            <p className="text-xs text-muted-foreground">
              Incidencias cerradas este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Críticos Abiertos
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{data.stats.critical}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
                {data.recentActivity.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No hay actividad reciente.</div>
                ) : (
                  data.recentActivity.map((ticket) => (
                    <div className="flex items-center" key={ticket.id}>
                        <div className="space-y-1">
                            <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                              <p className="text-sm font-medium leading-none">
                                {ticket.titulo}
                              </p>
                            </Link>
                            <p className="text-xs text-muted-foreground">
                                {ticket.status.replace("_", " ")} • Asignado a: {ticket.asignadoA?.name || "Sin asignar"}
                            </p>
                        </div>
                        <div className="ml-auto text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true, locale: es })}
                        </div>
                    </div>
                  ))
                )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Mis Asignaciones</CardTitle>
            </CardHeader>
             <CardContent>
                <div className="space-y-8">
                    {data.myAssignments.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No tienes tickets asignados.</div>
                    ) : (
                      data.myAssignments.map((ticket) => (
                        <div className="flex items-center justify-between" key={ticket.id}>
                            <div className="space-y-1">
                                <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                                  <p className="text-sm font-medium leading-none truncate max-w-[180px]">
                                    {ticket.titulo}
                                  </p>
                                </Link>
                                <p className="text-xs text-muted-foreground">
                                  {ticket.status.replace("_", " ")}
                                </p>
                            </div>
                            <Badge variant={ticket.prioridad === "CRITICA" || ticket.prioridad === "ALTA" ? "destructive" : "secondary"}>
                              {ticket.prioridad}
                            </Badge>
                        </div>
                      ))
                    )}
                </div>
             </CardContent>
        </Card>
      </div>
    </div>
  )
}
