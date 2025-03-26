import { GetAvailableCredits } from "@/actions/billing/get-available-credits";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { CoinsIcon } from "lucide-react";
import { ReactCountupWrapper } from "@/components/ui/react-countup-wrapper";
import { CreditsPurchase } from "./_components/credits-purchase";

export default function BillingPage() {
  return (
    <div>
      <h1>Billing</h1>
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
    </div>
  );
}

async function BalanceCard() {
  const userBalance = await GetAvailableCredits();
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between vlex-col overflow-hidden">
      <CardContent className="relative items-center p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Available Credits
            </h3>
            <p className="text-4xl font-bold text-primary">
              <ReactCountupWrapper value={userBalance} />
            </p>
          </div>
          <CoinsIcon
            size={140}
            className="text-primary opacity-20 absolute bottom-0 right-0"
          />
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        When you use the credits, they will be deducted from your balance.{" "}
        <br />
        if your balance reach zero, your workflows will stop running.
      </CardFooter>
    </Card>
  );
}
