import { getUnassignedTickets, getAgents } from "@/app/actions/dispatch"
import { DispatchClient } from "./dispatch-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Inbox } from "lucide-react"

export default async function DispatchPage() {
  const [tickets, agents] = await Promise.all([
    getUnassignedTickets(),
    getAgents()
  ])

  // Map prisma types to the expected shape if necessary, though it looks compatible
  // We might need to ensure plain objects are passed if dates cause issues, 
  // but Server Components to Client Components usually handle Date serialization in recent Next.js versions.
  // However, simple objects are safer. 
  // getUnassignedTickets returns objects that match TicketRow structure.

  return (
    <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Despacho de Tickets</h1>
                <p className="text-muted-foreground">Asigna tickets pendientes a los agentes técnicos disponibles.</p>
            </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Pendientes de Asignar
                    </CardTitle>
                    <Inbox className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{tickets.length}</div>
                    <p className="text-xs text-muted-foreground">
                        Tickets esperando técnico
                    </p>
                </CardContent>
            </Card>
        </div>

        <Card className="flex-1">
            <CardHeader className="p-4">
                <CardTitle className="text-lg">Cola de Asignación</CardTitle>
                <CardDescription>
                    Tickets creados que aún no tienen un agente responsable.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="px-4">
                    <DispatchClient tickets={tickets as any} agents={agents} />
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
