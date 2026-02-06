import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Lock } from "lucide-react"

interface CommentListProps {
  comments: any[]
  canViewInternal?: boolean
}

export function CommentList({ comments, canViewInternal = false }: CommentListProps) {
  // Filtrar comentarios internos si no tiene permiso
  const visibleComments = canViewInternal ? comments : comments.filter(c => !c.interno)
  if (visibleComments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No hay comentarios aún. Sé el primero en escribir algo.
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {visibleComments.map((comment) => (
        <div key={comment.id} className="flex gap-4">
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src={comment.autor.image} />
            <AvatarFallback>{comment.autor.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{comment.autor.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
              </span>
              {comment.interno && (
                <Badge variant="secondary" className="text-[10px] h-5 gap-1">
                  <Lock className="h-3 w-3" />
                  Interno
                </Badge>
              )}
            </div>
            <div className={`text-sm leading-relaxed p-3 rounded-md ${comment.interno ? "bg-muted/50 border border-dashed border-sidebar-border" : "bg-muted/30"}`}>
              {comment.contenido}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
