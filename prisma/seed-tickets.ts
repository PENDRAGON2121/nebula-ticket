import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Permisos
  const permissions = [
    { name: 'tickets:delete', description: 'Eliminar tickets (solo ADMIN)' },
    { name: 'tickets:edit', description: 'Editar tickets (solo ADMIN)' },
    { name: 'tickets:view_all', description: 'Ver todos los tickets (ADMIN y AGENTE)' },
    { name: 'comments:view_internal', description: 'Ver comentarios internos (ADMIN y AGENTE)' },
  ]

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    })
  }

  // Roles y asignación de permisos
  const allPerms = await prisma.permission.findMany()
  const adminPerms = allPerms.map(p => ({ id: p.id }))
  const agentPerms = allPerms.filter(p => p.name === 'tickets:view_all' || p.name === 'comments:view_internal').map(p => ({ id: p.id }))

  await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: { permissions: { set: adminPerms } },
    create: {
      name: 'ADMIN',
      description: 'Administrador',
      permissions: { connect: adminPerms },
    },
  })

  await prisma.role.upsert({
    where: { name: 'AGENTE' },
    update: { permissions: { set: agentPerms } },
    create: {
      name: 'AGENTE',
      description: 'Agente de soporte',
      permissions: { connect: agentPerms },
    },
  })

  await prisma.role.upsert({
    where: { name: 'USUARIO' },
    update: { permissions: { set: [] } },
    create: {
      name: 'USUARIO',
      description: 'Usuario final',
      permissions: { connect: [] },
    },
  })
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
