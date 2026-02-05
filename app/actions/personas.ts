'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function searchPersonas(query: string) {
  const session = await auth()
  if (!session?.user) {
    return []
  }

  if (!query || query.length < 2) {
    return []
  }

  try {
    const personas = await prisma.persona.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { departamento: { contains: query, mode: 'insensitive' } },
        ],
        activo: true
      },
      take: 10,
      select: {
        id: true,
        nombre: true,
        email: true,
        departamento: true,
        cargo: true
      }
    })
    return personas
  } catch (error) {
    console.error("Error searching personas:", error)
    return []
  }
}
