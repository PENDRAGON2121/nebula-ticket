"use client"

import * as React from "react"
import { Check, ChevronsUpDown, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { assignTicket } from "@/app/actions/dispatch"

interface Agent {
  id: string
  name: string | null
  email: string
  image: string | null
}

interface AgentAssignerProps {
  ticketId: string
  agents: Agent[]
}

export function AgentAssigner({ ticketId, agents }: AgentAssignerProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  
  const onSelect = async (agentId: string) => {
    setLoading(true)
    await assignTicket(ticketId, agentId)
    setLoading(false)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={loading}
        >
          {loading ? "Asignando..." : "Asignar Agente..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar agente..." />
          <CommandList>
            <CommandEmpty>No encontrado.</CommandEmpty>
            <CommandGroup>
              {agents.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={agent.name || agent.email}
                  onSelect={() => onSelect(agent.id)}
                >
                  <div className="flex items-center gap-2">
                     <Avatar className="h-6 w-6">
                        <AvatarImage src={agent.image || ""} />
                        <AvatarFallback>{agent.name?.slice(0,2).toUpperCase()}</AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">{agent.name}</span>
                        <span className="text-xs text-muted-foreground">{agent.email}</span>
                     </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      "opacity-0" // Always hidden as this is for assignment, not selection state display
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
