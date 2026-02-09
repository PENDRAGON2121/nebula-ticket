"use client"

import { useState, useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { TicketWithRelations } from "./columns"
import { deleteTicket } from "@/app/actions/tickets"

interface DataTableClientProps {
  columns: typeof columns
  data: (TicketWithRelations & { isMine?: boolean; canEdit?: boolean; canDelete?: boolean })[]
}

export function DataTableClient({ columns, data }: DataTableClientProps) {
  const [filters, setFilters] = useState({ assignedToMe: false, estado: "", prioridad: "", search: "" })
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteTicket(id)
      router.refresh()
    })
  }

  // Enriquecer datos con callback de delete
  const augmentedData = useMemo(() =>
    data.map(item => ({
      ...item,
      onDelete: handleDelete,
    })),
    [data]
  )

  // Aplicar filtros del lado del cliente
  const filteredData = useMemo(() => {
    let result = augmentedData

    if (filters.assignedToMe) {
      result = result.filter(t => t.isMine)
    }
    if (filters.estado) {
      result = result.filter(t => t.status === filters.estado)
    }
    if (filters.prioridad) {
      result = result.filter(t => t.prioridad === filters.prioridad)
    }
    if (filters.search) {
      const s = filters.search.toLowerCase()
      result = result.filter(t => t.titulo.toLowerCase().includes(s))
    }

    return result
  }, [augmentedData, filters])

  return (
    <DataTable columns={columns} data={filteredData} filters={filters} onFiltersChange={setFilters} />
  )
}
