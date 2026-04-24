import { useListReviews, useGetReviewSummary, useCreateReview, getListReviewsQueryKey, getGetReviewSummaryQueryKey } from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters").max(60),
  rating: z.number().min(1).max(5),
  text: z.string().min(5, "Review must be at least 5 characters").max(1000),
});

export default function Reviews() {
  const { t } = useLang();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: summary, isLoading: summaryLoading } = useGetReviewSummary();
  const { data: reviews, isLoading: reviewsLoading } = useListReviews();
  
  const { mutate: submitReview, isPending } = useCreateReview({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetReviewSummaryQueryKey() });
        toast({ title: "Review submitted", description: "Thank you for your feedback!" });
        form.reset({ username: "", rating: 5, text: "" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to submit review.", variant: "destructive" });
      }
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      rating: 5,
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitReview({ data: values });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/3 space-y-8">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-4">{t("reviews")}</h1>
            <p className="text-muted-foreground mb-6">Read what our community has to say about their experience.</p>
            
            {summaryLoading ? (
              <Skeleton className="h-24 w-full rounded-xl" />
            ) : summary ? (
              <div className="flex items-center gap-4 bg-muted/50 p-6 rounded-xl">
                <div className="text-5xl font-bold font-serif">{summary.averageRating.toFixed(1)}</div>
                <div>
                  <div className="flex items-center mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < Math.round(summary.averageRating) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">Based on {summary.count} reviews</div>
                </div>
              </div>
            ) : null}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("writeReview")}</CardTitle>
              <CardDescription>Share your CAFE 43 experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <button
                                type="button"
                                key={i}
                                onClick={() => field.onChange(i + 1)}
                                className="focus:outline-none p-1 hover:scale-110 transition-transform"
                              >
                                <Star className={`h-6 w-6 ${i < field.value ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review</FormLabel>
                        <FormControl>
                          <Textarea placeholder="What did you think?" className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Submitting..." : t("submit")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-2/3">
          <div className="grid sm:grid-cols-2 gap-6">
            {reviewsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))
            ) : reviews?.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No reviews yet. Be the first!
              </div>
            ) : (
              reviews?.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
