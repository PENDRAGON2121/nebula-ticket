"use client"

import { DataTable } from "./data-table"
import { getColumns, TicketRow } from "./columns"

interface DispatchClientProps {
    tickets: TicketRow[]
    agents: any[]
}

export function DispatchClient({ tickets, agents }: DispatchClientProps) {
    const columns = getColumns(agents)
    return <DataTable columns={columns} data={tickets} />
}
