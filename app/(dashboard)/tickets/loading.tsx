import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
            </div>
            <Skeleton className="h-10 w-[120px]" />
        </div>
        
        <Card className="flex-1">
            <CardHeader className="p-4 space-y-2">
                <Skeleton className="h-6 w-[180px]" />
                <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-10 w-[300px]" />
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-[80px]" />
                            <Skeleton className="h-9 w-[80px]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
