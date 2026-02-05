import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function Page() {
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 desde la última hora
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
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              3 técnicos activos
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
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">
              +19% respecto al mes anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Críticos
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
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
                {/* Mock data */}
                <div className="flex items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Ticket #1234 - Laptop no enciende</p>
                        <p className="text-sm text-muted-foreground">Juan Perez actualizó el estado a En Progreso</p>
                    </div>
                    <div className="ml-auto font-medium">Hace 5m</div>
                </div>
                <div className="flex items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Ticket #1233 - Solicitud de acceso</p>
                        <p className="text-sm text-muted-foreground">Maria Garcia creó un nuevo ticket</p>
                    </div>
                    <div className="ml-auto font-medium">Hace 15m</div>
                </div>
                 <div className="flex items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Ticket #1230 - Impresora atascada</p>
                        <p className="text-sm text-muted-foreground">Carlos Ruiz cerró el ticket</p>
                    </div>
                    <div className="ml-auto font-medium">Hace 1h</div>
                </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Mis Asignaciones</CardTitle>
            </CardHeader>
             <CardContent>
                <div className="space-y-8">
                     <div className="flex items-center">
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Cambio de toner</p>
                            <p className="text-sm text-muted-foreground">Alta Prioridad</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Instalación Office</p>
                            <p className="text-sm text-muted-foreground">Baja Prioridad</p>
                        </div>
                    </div>
                </div>
             </CardContent>
        </Card>
      </div>
    </div>
  )
}
