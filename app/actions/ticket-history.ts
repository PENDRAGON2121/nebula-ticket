import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getTicketHistory(ticketId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("No autorizado")
  return prisma.ticketHistory.findMany({
    where: { ticketId },
    include: {
      changedBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}
