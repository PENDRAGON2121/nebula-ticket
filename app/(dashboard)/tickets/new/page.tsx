import { CreateTicketForm } from "@/components/tickets/create-ticket-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function NewTicketPage() {
  return (
    <div className="max-w-2xl mx-auto py-6">
        <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Nuevo Ticket</h1>
            <p className="text-muted-foreground">Reporta una incidencia o solicita servicio técnico.</p>
        </div>
        <Separator className="my-6" />
        <Card>
            <CardHeader>
                <CardTitle>Detalles del Incidente</CardTitle>
                <CardDescription>Proporciona toda la información posible para ayudarnos a resolverlo rápido.</CardDescription>
            </CardHeader>
            <CardContent>
                <CreateTicketForm />
            </CardContent>
        </Card>
    </div>
  )
}
