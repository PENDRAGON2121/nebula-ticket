import { auth } from "@/lib/auth"

export async function hasPermission(permission: string): Promise<boolean> {
  const session = await auth()
  const perms = (session?.user as any)?.permissions
  if (!perms) return false
  return perms.includes(permission)
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth()
  return (session?.user as any)?.role === 'ADMIN'
}

export async function isAgent(): Promise<boolean> {
  const session = await auth()
  return (session?.user as any)?.role === 'AGENTE'
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
