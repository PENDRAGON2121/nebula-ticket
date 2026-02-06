import { z } from "zod"

export const createTicketSchema = z.object({
  titulo: z.string().min(5, {
    message: "El título debe tener al menos 5 caracteres.",
  }),
  descripcion: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  prioridad: z.enum(["BAJA", "MEDIA", "ALTA", "CRITICA"]),
  activoId: z.string().optional(),
})

export type CreateTicketValues = z.infer<typeof createTicketSchema>

export const updateTicketSchema = z.object({
  titulo: z.string().min(5).optional(),
  descripcion: z.string().min(10).optional(),
  prioridad: z.enum(["BAJA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  status: z.enum(["ABIERTO", "EN_PROGRESO", "ESPERA_CLIENTE", "RESUELTO", "CERRADO"]).optional(),
  asignadoAId: z.string().optional().nullable(),
  activoId: z.string().optional().nullable(),
})

export type UpdateTicketData = z.infer<typeof updateTicketSchema>
