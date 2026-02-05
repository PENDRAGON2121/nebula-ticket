'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export type SearchResult = {
  id: string
  title: string
  subtitle: string
  type: 'ticket' | 'asset'
  url: string
}

export async function globalSearchAction(query: string): Promise<SearchResult[]> {
  const session = await auth()
  if (!session?.user) return []

  if (!query || query.length < 2) return []

  const results: SearchResult[] = []

  // Search Tickets
  const tickets = await prisma.ticket.findMany({
    where: {
      OR: [
        { titulo: { contains: query, mode: 'insensitive' } },
        { descripcion: { contains: query, mode: 'insensitive' } },
        { id: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 5,
    orderBy: { createdAt: 'desc' }
  })

  tickets.forEach(ticket => {
    results.push({
      id: ticket.id,
      title: ticket.titulo,
      subtitle: `Ticket #${ticket.id.slice(-6)} • ${ticket.status}`,
      type: 'ticket',
      url: `/tickets/${ticket.id}`
    })
  })

  // Search Assets (Read-only access)
  const assets = await prisma.activo.findMany({
    where: {
      OR: [
        { nombre: { contains: query, mode: 'insensitive' } },
        { serial: { contains: query, mode: 'insensitive' } },
        { codigoInterno: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 3
  })

  assets.forEach(asset => {
    results.push({
      id: asset.id,
      title: asset.nombre,
      subtitle: `S/N: ${asset.serial || 'N/A'} • ${asset.codigoInterno}`,
      type: 'asset',
      // In nebula-ticket we don't have asset details page yet, but maybe we can link to search filter?
      // For now let's just show them, or link to a future asset view
      url: `/tickets/new` // Placeholder: maybe pre-fill a new ticket with this asset?
    })
  })

  return results
}
