'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { TicketStatus, TicketPriority } from "@prisma/client"

export async function addComment(ticketId: string, content: string, interno: boolean = false) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "No autorizado" }
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

  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status }
    })
    revalidatePath(`/tickets/${ticketId}`)
    revalidatePath(`/tickets`)
    return { success: true }
  } catch (error) {
    return { error: "Error actualizando estado" }
  }
}

export async function updateTicketPriority(ticketId: string, priority: TicketPriority) {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { prioridad: priority }
    })
    revalidatePath(`/tickets/${ticketId}`)
    revalidatePath(`/tickets`)
    return { success: true }
  } catch (error) {
    return { error: "Error actualizando prioridad" }
  }
}
