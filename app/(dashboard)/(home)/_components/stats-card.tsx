import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactCountupWrapper } from "@/components/ui/react-countup-wrapper";
import { LucideIcon } from "lucide-react";
import React from "react";

export const StatsCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
}) => {
  return (
    <Card className="relative overflow-hidden h-full">
      <CardHeader className="flex pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon
          className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10"
          size={120}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-emerald-500">
          <ReactCountupWrapper value={value} />
        </div>
      </CardContent>
    </Card>
  );
};
