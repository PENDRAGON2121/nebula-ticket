"use client"

import { useState } from "react"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { TicketWithRelations } from "./columns"

interface DataTableClientProps {
  columns: typeof columns
  data: TicketWithRelations[]
}

export function DataTableClient({ columns, data }: DataTableClientProps) {
  const [filters, setFilters] = useState({ assignedToMe: false, estado: "", prioridad: "", search: "" })
  return (
    <DataTable columns={columns} data={data} filters={filters} onFiltersChange={setFilters} />
  )
}
