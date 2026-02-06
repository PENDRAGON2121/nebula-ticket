import { format } from "date-fns"
import { Clock, User, Edit2 } from "lucide-react"

interface TicketHistoryProps {
  history: Array<{
    id: string
    fieldName: string
    oldValue: string | null
    newValue: string | null
    createdAt: string
    changedBy: { id: string; name: string | null }
  }>
}

const fieldLabels: Record<string, string> = {
  titulo: "Título",
  descripcion: "Descripción",
  status: "Estado",
  prioridad: "Prioridad",
  asignadoAId: "Asignado a",
  activoId: "Activo vinculado",
}

export function TicketHistory({ history }: TicketHistoryProps) {
  if (!history.length) return <div className="text-muted-foreground text-sm">Sin historial de cambios.</div>
  return (
    <div className="space-y-4">
      {history.map(item => (
        <div key={item.id} className="flex gap-3 items-center border-b pb-2">
          <Edit2 className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground flex gap-2 items-center">
              <User className="w-3 h-3" />
              {item.changedBy.name || "Usuario"}
              <Clock className="w-3 h-3 ml-2" />
              {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
            </div>
            <div className="text-sm">
              <b>{fieldLabels[item.fieldName] || item.fieldName}:</b> <span className="line-through text-muted-foreground">{item.oldValue ?? "-"}</span> → <span>{item.newValue ?? "-"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
