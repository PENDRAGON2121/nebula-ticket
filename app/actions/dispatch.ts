'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getUnassignedTickets() {
  const session = await auth()
  if (!session?.user) return []

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        asignadoAId: null,
        status: {
            notIn: ['CERRADO', 'RESUELTO']
        }
      },
      include: {
        creadoPor: {
            select: { name: true, image: true, email: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return tickets
  } catch (error) {
    console.error("Error fetching unassigned tickets:", error)
    return []
  }
}

export async function getAgents() {
    const session = await auth()
    if (!session?.user) return []
  
    try {
      // In a real app, filtering by role would happen here.
      // For now, we assume all users can be agents.
      const agents = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        },
        orderBy: {
            name: 'asc'
        }
      })
      return agents
    } catch (error) {
      console.error("Error fetching agents:", error)
      return []
    }
  }

export async function assignTicket(ticketId: string, userId: string) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  try {
    await prisma.ticket.update({
        where: { id: ticketId },
        data: {
            asignadoAId: userId,
            status: "ABIERTO" // Ensure it's open or In Progress
        }
    })

    revalidatePath("/asignaciones")
    revalidatePath("/tickets")
    return { success: true }
  } catch (error) {
    console.error("Error assigning ticket:", error)
    return { error: "Error al asignar el ticket" }
  }
}
