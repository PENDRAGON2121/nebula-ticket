'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function searchAssets(query: string) {
  const session = await auth()
  if (!session?.user) {
    return []
  }

  if (!query || query.length < 2) {
    return []
  }

  try {
    const assets = await prisma.activo.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { serial: { contains: query, mode: 'insensitive' } },
          { codigoInterno: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 10,
      select: {
        id: true,
        nombre: true,
        serial: true,
        codigoInterno: true,
        estado: true
      }
    })
    return assets
  } catch (error) {
    console.error("Error searching assets:", error)
    return []
  }
}
