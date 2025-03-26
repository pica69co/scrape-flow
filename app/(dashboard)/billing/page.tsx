import { GetAvailableCredits } from "@/actions/billing/get-available-credits";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { ArrowLeftRightIcon, CoinsIcon } from "lucide-react";
import { ReactCountupWrapper } from "@/components/ui/react-countup-wrapper";
import { CreditsPurchase } from "./_components/credits-purchase";
import { Periods } from "@/types/analytics";
import { getCreditUsageToPeriod } from "@/actions/analytics/get-credit-usage-to-period";
import { CreditUsageChart } from "./_components/credit-usage-chart";
import { GetUserPurchaseHistory } from "@/actions/billing/get-user-purchase-history";
import { InvoiceBtn } from "./_components/invoice-button";

export default function BillingPage() {
  return (
    <div>
      <h1>Billing</h1>
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
      <Suspense fallback={<Skeleton className="h-[300px]" />}>
        <CreditsUsageCard />
      </Suspense>
      <Suspense>
        <TransactionalHistoryCard />
      </Suspense>
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

async function CreditsUsageCard() {
  const period: Periods = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };
  const data = await getCreditUsageToPeriod(period);
  return (
    <CreditUsageChart
      data={data}
      title="Credits consumed"
      description="Credits consumed in the current month"
    />
  );
}

async function TransactionalHistoryCard() {
  const purchases = await GetUserPurchaseHistory();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ArrowLeftRightIcon className="size-6 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View your transaction history and download invoices.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You have no transaction history. Choose a plan to get started.
          </p>
        )}
        {purchases.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center py-3 border-b last:border-b-0"
          >
            <div>
              <p className="font-medium">{formatDate(item.date)}</p>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatAmount(item.amount, item.currency)}
              </p>
              <InvoiceBtn id={item.id} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount / 100);
  }
}
