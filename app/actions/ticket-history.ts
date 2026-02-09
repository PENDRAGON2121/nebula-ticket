'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { canAccessTicket } from "@/lib/permissions"

export async function getTicketHistory(ticketId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("No autorizado")

  // Verificar que el usuario tiene acceso al ticket
  const { allowed } = await canAccessTicket(ticketId)
  if (!allowed) throw new Error("No tienes acceso a este ticket")

  return prisma.ticketHistory.findMany({
    where: { ticketId },
    include: {
      changedBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}
