import { columns } from "./columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { DataTableClient } from "./data-table-client"

export default async function TicketsPage() {
  // Obtener datos del backend
  // (En producción, los filtros se pueden pasar por searchParams)
  const data = await fetchTicketsFromServer()
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

async function fetchTicketsFromServer() {
  // Aquí deberías llamar a tu action getTickets o similar
  // Ejemplo:
  // return await getTickets({ ... })
  // Por ahora, retorna un array vacío para evitar errores
  return []
}
