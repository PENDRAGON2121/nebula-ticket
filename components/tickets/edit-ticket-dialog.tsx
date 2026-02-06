"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface EditTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues: {
    titulo: string
    descripcion: string
    prioridad: string
    status: string
    asignadoAId?: string | null
    activoId?: string | null
  }
  onSubmit: (values: EditTicketDialogProps["initialValues"]) => void
  users: Array<{ id: string; name: string }>
  activos: Array<{ id: string; nombre: string }>
}

export function EditTicketDialog({ open, onOpenChange, initialValues, onSubmit, users, activos }: EditTicketDialogProps) {
  const [values, setValues] = useState(initialValues)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            value={values.titulo}
            onChange={e => setValues(v => ({ ...v, titulo: e.target.value }))}
            placeholder="Título"
          />
          <Textarea
            value={values.descripcion}
            onChange={e => setValues(v => ({ ...v, descripcion: e.target.value }))}
            placeholder="Descripción"
          />
          <Select value={values.prioridad} onValueChange={prioridad => setValues(v => ({ ...v, prioridad }))}>
            <SelectTrigger>
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BAJA">Baja</SelectItem>
              <SelectItem value="MEDIA">Media</SelectItem>
              <SelectItem value="ALTA">Alta</SelectItem>
              <SelectItem value="CRITICA">Crítica</SelectItem>
            </SelectContent>
          </Select>
          <Select value={values.status} onValueChange={status => setValues(v => ({ ...v, status }))}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ABIERTO">Abierto</SelectItem>
              <SelectItem value="EN_PROGRESO">En progreso</SelectItem>
              <SelectItem value="ESPERA_CLIENTE">Espera cliente</SelectItem>
              <SelectItem value="RESUELTO">Resuelto</SelectItem>
              <SelectItem value="CERRADO">Cerrado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={values.asignadoAId ?? ""} onValueChange={asignadoAId => setValues(v => ({ ...v, asignadoAId }))}>
            <SelectTrigger>
              <SelectValue placeholder="Asignar a..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sin asignar</SelectItem>
              {users.map(u => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={values.activoId ?? ""} onValueChange={activoId => setValues(v => ({ ...v, activoId }))}>
            <SelectTrigger>
              <SelectValue placeholder="Activo vinculado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sin activo</SelectItem>
              {activos.map(a => (
                <SelectItem key={a.id} value={a.id}>{a.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={() => onSubmit(values)}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
