import { Review } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { format } from "date-fns";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">{review.username}</div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(review.createdAt), "MMM d, yyyy")}
          </div>
        </div>
        <div className="flex items-center mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
      </CardContent>
    </Card>
  );
}
