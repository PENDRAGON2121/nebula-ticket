import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function hasPermission(permission: string): Promise<boolean> {
  const session = await auth()
  const perms = session?.user?.permissions
  if (!perms) return false
  return perms.includes(permission)
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth()
  return session?.user?.role === 'ADMIN'
}

export async function isAgent(): Promise<boolean> {
  const session = await auth()
  return session?.user?.role === 'AGENTE'
}

export async function canEditTicket(): Promise<boolean> {
  return await isAdmin()
}

export async function canDeleteTicket(): Promise<boolean> {
  return await isAdmin()
}

export async function canViewAllTickets(): Promise<boolean> {
  return await hasPermission('tickets:view_all')
}

export async function canViewInternalComments(): Promise<boolean> {
  return await hasPermission('comments:view_internal')
}

/**
 * Verifica si el usuario actual puede acceder (ver) un ticket.
 * Admin/Agente pueden ver todos. Usuario solo los suyos.
 * Retorna el ticket si tiene acceso para reusar en el caller.
 */
export async function canAccessTicket(ticketId: string): Promise<{ allowed: boolean; ticket: any }> {
  const session = await auth()
  if (!session?.user?.id) return { allowed: false, ticket: null }

  const ticket = await prisma.ticket.findFirst({
    where: { id: ticketId, deletedAt: null },
  })
  if (!ticket) return { allowed: false, ticket: null }

  if (await canViewAllTickets()) return { allowed: true, ticket }
  if (ticket.creadoPorId === session.user.id) return { allowed: true, ticket }

  return { allowed: false, ticket: null }
}

/**
 * Verifica si el usuario actual puede modificar (status/prioridad) un ticket.
 * Admin siempre puede. Agente puede si esta asignado al ticket.
 */
export async function canModifyTicket(ticketId: string): Promise<{ allowed: boolean; ticket: any }> {
  const session = await auth()
  if (!session?.user?.id) return { allowed: false, ticket: null }

  const ticket = await prisma.ticket.findFirst({
    where: { id: ticketId, deletedAt: null },
  })
  if (!ticket) return { allowed: false, ticket: null }

  if (await canEditTicket()) return { allowed: true, ticket }
  if (await isAgent() && ticket.asignadoAId === session.user.id) return { allowed: true, ticket }

  return { allowed: false, ticket: null }
}
