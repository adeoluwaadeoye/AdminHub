import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-48" />
        </div>
        <div className="rounded-lg border overflow-hidden">
          {/* header */}
          <div className="flex gap-4 px-4 py-3 bg-muted/50">
            {[40, 80, 100, 60, 60, 60].map((w, i) => (
              <Skeleton key={i} className="h-3" style={{ width: w }} />
            ))}
          </div>
          {/* rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4 px-4 py-3 border-t">
              {[40, 80, 100, 60, 60, 60].map((w, j) => (
                <Skeleton key={j} className="h-3" style={{ width: w }} />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
