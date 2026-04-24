import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/format";

export default function CheckoutSuccess() {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");
  const total = searchParams.get("total");

  return (
    <div className="container mx-auto px-4 py-32 text-center max-w-lg">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
      </div>
      
      <h1 className="font-serif text-4xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Thank you for your order. We are preparing it right now.
      </p>
      
      <div className="bg-card border rounded-xl p-6 mb-10 text-left">
        <div className="grid grid-cols-2 gap-y-4">
          <div className="text-muted-foreground">Order ID</div>
          <div className="font-medium font-mono text-right">#{id?.padStart(4, '0') || '1234'}</div>
          
          <div className="text-muted-foreground">Total Amount</div>
          <div className="font-medium text-right text-primary">{total ? formatPrice(Number(total)) : '₾0.00'}</div>
          
          <div className="text-muted-foreground">Status</div>
          <div className="font-medium text-right text-orange-500">Pending</div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/menu">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">Order More</Button>
        </Link>
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
