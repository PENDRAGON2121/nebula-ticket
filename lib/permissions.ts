import { auth } from "@/lib/auth"

export async function hasPermission(permission: string): Promise<boolean> {
  const session = await auth()
  if (!session?.user?.permissions) return false
  return session.user.permissions.includes(permission)
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
