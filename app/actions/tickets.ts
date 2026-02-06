'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createTicketSchema, updateTicketSchema, type UpdateTicketData } from "@/lib/schemas"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { canViewAllTickets, canEditTicket, canDeleteTicket } from "@/lib/permissions"

export async function createTicket(prevState: any, formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return {
      error: "No estás autenticado",
    }
  }

  // Parse raw data first to handle potential empty strings for optional fields
  const rawData = {
    titulo: formData.get("titulo"),
    descripcion: formData.get("descripcion"),
    prioridad: formData.get("prioridad"),
    activoId: formData.get("activoId") || undefined, // Convert empty string to undefined
  }

  const validatedFields = createTicketSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      error: "Campos inválidos",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { titulo, descripcion, prioridad, activoId } = validatedFields.data

  try {
    await prisma.ticket.create({
      data: {
        titulo,
        descripcion,
        prioridad: prioridad as any, // Prisma enum casting
        status: "ABIERTO",
        creadoPorId: session.user.id,
        activoId: activoId,
        // Optionally assign to self if the user is a technician, but better to leave unassigned or auto-assign logic later
      },
    })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return {
      error: "Error al crear el ticket en la base de datos",
    }
  }

  revalidatePath("/tickets")
  redirect("/tickets")
}

export async function getTickets({
  assignedToMe,
  estado,
  prioridad,
  search,
  userId,
  sessionUserId,
}: {
  assignedToMe?: boolean
  estado?: string
  prioridad?: string
  search?: string
  userId?: string
  sessionUserId?: string
}) {
  const session = await auth()
  if (!session?.user?.id) return []

  const isAdminOrAgent = await canViewAllTickets()

  // Filtro base: soft delete
  const where: any = { deletedAt: null }

  // Permisos: ADMIN/AGENTE ven todos, USUARIO solo sus tickets
  if (!isAdminOrAgent) {
    where.creadoPorId = session.user.id
  }

  // Filtro: asignado a mí
  if (assignedToMe) {
    where.asignadoAId = session.user.id
  }

  // Filtro: estado
  if (estado) {
    where.status = estado
  }

  // Filtro: prioridad
  if (prioridad) {
    where.prioridad = prioridad
  }

  // Filtro: búsqueda
  if (search) {
    where.OR = [
      { titulo: { contains: search, mode: "insensitive" } },
      { descripcion: { contains: search, mode: "insensitive" } },
    ]
  }

  return prisma.ticket.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      asignadoA: { select: { id: true, name: true, image: true, email: true } },
      creadoPor: { select: { id: true, name: true, image: true } },
      activo: { select: { id: true, nombre: true } },
    },
  })
}

export async function updateTicket(ticketId: string, data: UpdateTicketData) {
  const session = await auth()
  if (!session?.user?.id || !(await canEditTicket())) {
    throw new Error("No autorizado")
  }

  // Validar datos
  const validated = updateTicketSchema.safeParse(data)
  if (!validated.success) {
    throw new Error("Datos inválidos")
  }

  // Obtener ticket actual
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
  if (!ticket) throw new Error("Ticket no encontrado")

  // Registrar historial de cambios
  const changes = Object.entries(validated.data).filter(([k, v]) => v !== (ticket as any)[k])
  for (const [field, newValue] of changes) {
    await prisma.ticketHistory.create({
      data: {
        ticketId,
        changedById: session.user.id,
        fieldName: field,
        oldValue: (ticket as any)[field]?.toString() ?? null,
        newValue: newValue?.toString() ?? null,
      },
    })
  }

  // Actualizar ticket
  await prisma.ticket.update({
    where: { id: ticketId },
    data: validated.data,
  })

  revalidatePath("/tickets")
}

export async function deleteTicket(ticketId: string) {
  const session = await auth()
  if (!session?.user?.id || !(await canDeleteTicket())) {
    throw new Error("No autorizado")
  }
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { deletedAt: new Date() },
  })
  revalidatePath("/tickets")
}
