'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createTicketSchema } from "@/lib/schemas"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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
