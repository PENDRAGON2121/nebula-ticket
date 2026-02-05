"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTicketSchema, CreateTicketValues } from "@/lib/schemas"
import { createTicket } from "@/app/actions/tickets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AssetSelector } from "./asset-selector"
import { useTransition, useState } from "react"
import { AlertCircle } from "lucide-react"

export function CreateTicketForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CreateTicketValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      prioridad: "MEDIA",
    },
  })

  function onSubmit(values: CreateTicketValues) {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append("titulo", values.titulo)
      formData.append("descripcion", values.descripcion)
      formData.append("prioridad", values.prioridad)
      if (values.activoId) {
        formData.append("activoId", values.activoId)
      }

      const result = await createTicket(null, formData)
      
      if (result?.error) {
        setError(result.error)
      }
      // If success, the action redirects, so we don't need to do anything here
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
            </div>
        )}
        
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del Incidente</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Laptop no enciende" {...field} />
              </FormControl>
              <FormDescription>
                Breve resumen del problema.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción Detallada</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explica qué sucedió, pasos para reproducir, etc."
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="prioridad"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Prioridad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una prioridad" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="BAJA">Baja - No urgente</SelectItem>
                    <SelectItem value="MEDIA">Media - Afecta trabajo normal</SelectItem>
                    <SelectItem value="ALTA">Alta - Bloqueo de trabajo</SelectItem>
                    <SelectItem value="CRITICA">Crítica - Sistema caído</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="activoId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Dispositivo Afectado (Opcional)</FormLabel>
                <FormControl>
                    <AssetSelector 
                        value={field.value} 
                        onChange={field.onChange} 
                    />
                </FormControl>
                <FormDescription>
                    Busca por nombre, serial o placa.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => history.back()}>
                Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
                {isPending ? "Creando Ticket..." : "Crear Ticket"}
            </Button>
        </div>
      </form>
    </Form>
  )
}
