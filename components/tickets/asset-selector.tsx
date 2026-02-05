"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, Laptop } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

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
import { searchAssets } from "@/app/actions/assets"

interface Asset {
  id: string
  nombre: string
  serial: string | null
  codigoInterno: string
  estado: string
}

interface AssetSelectorProps {
  value?: string
  onChange: (value: string) => void
  onlyAvailable?: boolean
}

export function AssetSelector({ value, onChange, onlyAvailable = false }: AssetSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [loading, setLoading] = React.useState(false)
  
  // Find the selected asset object if value is present (might need to fetch initial if not in list, 
  // but for creation flow usually starts empty)
  const selectedAsset = assets.find((asset) => asset.id === value)

  const handleSearch = useDebouncedCallback(async (term: string) => {
    if (term.length < 2) {
        setAssets([])
        return
    }
    setLoading(true)
    const results = await searchAssets(term, onlyAvailable)
    // @ts-ignore: Enum mismatch possible but we just need display strings
    setAssets(results)
    setLoading(false)
  }, 300)

  React.useEffect(() => {
    handleSearch(query)
  }, [query, handleSearch])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? selectedAsset?.nombre || "Activo seleccionado (ID oculto)" 
            : "Buscar activo..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}> {/* We filter on server */}
          <CommandInput 
            placeholder="Buscar por nombre, serial o placa..." 
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading && <div className="py-6 text-center text-sm text-muted-foreground">Buscando...</div>}
            {!loading && assets.length === 0 && query.length >= 2 && (
                <CommandEmpty>No se encontraron activos.</CommandEmpty>
            )}
            {!loading && assets.length === 0 && query.length < 2 && (
                <div className="py-6 text-center text-sm text-muted-foreground">Escribe al menos 2 caracteres</div>
            )}
            <CommandGroup>
              {assets.map((asset) => (
                <CommandItem
                  key={asset.id}
                  value={asset.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === asset.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{asset.nombre}</span>
                    <span className="text-xs text-muted-foreground">
                        {asset.codigoInterno} • {asset.serial} • {asset.estado}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
