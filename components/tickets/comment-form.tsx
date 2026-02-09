"use client"

import * as React from "react"
import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { addComment } from "@/app/actions/ticket-details"

interface CommentFormProps {
  ticketId: string
  canViewInternal?: boolean
}

export function CommentForm({ ticketId, canViewInternal = false }: CommentFormProps) {
  const [content, setContent] = React.useState("")
  const [interno, setInterno] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    const result = await addComment(ticketId, content, interno)
    setLoading(false)

    if (result.success) {
      setContent("")
      // Optional: Toast success
    } else {
      // Optional: Toast error
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="grid gap-2">
        <Textarea
          placeholder="Escribe un comentario o actualización..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {canViewInternal && (
            <>
              <Checkbox
                id="interno"
                checked={interno}
                onCheckedChange={(checked) => setInterno(checked as boolean)}
              />
              <Label htmlFor="interno" className="text-sm text-muted-foreground">
                Nota interna (visible solo para técnicos)
              </Label>
            </>
          )}
        </div>
        <Button type="submit" size="sm" disabled={loading || !content.trim()}>
          <SendHorizontal className="mr-2 h-4 w-4" />
          {loading ? "Enviando..." : "Enviar Comentario"}
        </Button>
      </div>
    </form>
  )
}
