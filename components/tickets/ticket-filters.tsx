"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface TicketFiltersProps {
  value: {
    assignedToMe: boolean
    estado: string
    prioridad: string
    search: string
  }
  onChange: (filters: TicketFiltersProps["value"]) => void
}

export function TicketFilters({ value, onChange }: TicketFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 items-end">
      <Switch
        checked={value.assignedToMe}
        onCheckedChange={(v: boolean) => onChange({ ...value, assignedToMe: v })}
        label="Asignado a mí"
      />
      <Select
        value={value.estado || "ALL"}
        onValueChange={estado => onChange({ ...value, estado: estado === "ALL" ? "" : estado })}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="ABIERTO">Abierto</SelectItem>
          <SelectItem value="EN_PROGRESO">En progreso</SelectItem>
          <SelectItem value="ESPERA_CLIENTE">Espera cliente</SelectItem>
          <SelectItem value="RESUELTO">Resuelto</SelectItem>
          <SelectItem value="CERRADO">Cerrado</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={value.prioridad || "ALL"}
        onValueChange={prioridad => onChange({ ...value, prioridad: prioridad === "ALL" ? "" : prioridad })}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Prioridad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas</SelectItem>
          <SelectItem value="BAJA">Baja</SelectItem>
          <SelectItem value="MEDIA">Media</SelectItem>
          <SelectItem value="ALTA">Alta</SelectItem>
          <SelectItem value="CRITICA">Crítica</SelectItem>
        </SelectContent>
      </Select>
      <Input
        className="w-48"
        placeholder="Buscar..."
        value={value.search}
        onChange={e => onChange({ ...value, search: e.target.value })}
      />
      <Button variant="outline" onClick={() => onChange({ assignedToMe: false, estado: "", prioridad: "", search: "" })}>
        Limpiar
      </Button>
    </div>
  )
}
