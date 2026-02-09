'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { TicketStatus, TicketPriority } from "@prisma/client"
import { canViewInternalComments, canAccessTicket, canModifyTicket } from "@/lib/permissions"

export async function addComment(ticketId: string, content: string, interno: boolean = false) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "No autorizado" }
  }

  // Verificar que el usuario tiene acceso al ticket
  const { allowed } = await canAccessTicket(ticketId)
  if (!allowed) {
    return { error: "No tienes acceso a este ticket" }
  }

  // Si el comentario es interno, verificar permiso
  if (interno && !(await canViewInternalComments())) {
    return { error: "No tienes permiso para comentarios internos" }
  }
  if (!content || content.trim().length === 0) {
    return { error: "El comentario no puede estar vacío" }
  }

  try {
    await prisma.ticketComment.create({
      data: {
        contenido: content,
        interno: interno,
        ticketId: ticketId,
        autorId: session.user.id
      }
    })

    revalidatePath(`/tickets/${ticketId}`)
    return { success: true }
  } catch (error) {
    console.error("Error adding comment:", error)
    return { error: "Error al guardar el comentario" }
  }
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus) {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  // Verificar permisos de modificacion
  const { allowed, ticket } = await canModifyTicket(ticketId)
  if (!allowed) return { error: "No tienes permisos para modificar este ticket" }

  try {
    // Registrar en historial si el valor cambio
    if (ticket.status !== status) {
      await prisma.ticketHistory.create({
        data: {
          ticketId,
          changedById: session.user.id,
          fieldName: "status",
          oldValue: ticket.status,
          newValue: status,
        },
      })
    }

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status }
    })
    revalidatePath(`/tickets/${ticketId}`)
    revalidatePath(`/tickets`)
    return { success: true }
  } catch (error) {
    console.error("Error updating ticket status:", error)
    return { error: "Error actualizando estado" }
  }
}

export async function updateTicketPriority(ticketId: string, priority: TicketPriority) {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  // Verificar permisos de modificacion
  const { allowed, ticket } = await canModifyTicket(ticketId)
  if (!allowed) return { error: "No tienes permisos para modificar este ticket" }

  try {
    // Registrar en historial si el valor cambio
    if (ticket.prioridad !== priority) {
      await prisma.ticketHistory.create({
        data: {
          ticketId,
          changedById: session.user.id,
          fieldName: "prioridad",
          oldValue: ticket.prioridad,
          newValue: priority,
        },
      })
    }

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { prioridad: priority }
    })
    revalidatePath(`/tickets/${ticketId}`)
    revalidatePath(`/tickets`)
    return { success: true }
  } catch (error) {
    console.error("Error updating ticket priority:", error)
    return { error: "Error actualizando prioridad" }
  }
}
