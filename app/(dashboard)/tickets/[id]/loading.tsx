import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Main Content */}
      <div className="md:col-span-2 space-y-6">
        <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-[300px]" />
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[150px]" />
            </div>
        </div>

        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-[100px]" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                     {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        </div>
                     ))}
                </div>
                <Separator className="my-6" />
                <Skeleton className="h-[100px] w-full" />
                <div className="flex justify-between mt-4">
                     <Skeleton className="h-5 w-[200px]" />
                     <Skeleton className="h-9 w-[150px]" />
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <Skeleton className="h-5 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <Skeleton className="h-5 w-[150px]" />
            </CardHeader>
            <CardContent>
                 <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-3 w-[80px]" />
                        <Skeleton className="h-3 w-[100px]" />
                    </div>
                 </div>
            </CardContent>
        </Card>

        <Card>
             <CardHeader>
                <Skeleton className="h-5 w-[100px]" />
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-3 w-[150px]" />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
