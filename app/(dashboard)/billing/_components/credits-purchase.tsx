"use client";

import { PurchaseCredits } from "@/actions/billing/purchase-credits";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { creditsPack, PackId } from "@/types/billing";
import { useMutation } from "@tanstack/react-query";

import { CoinsIcon, CreditCard } from "lucide-react";
import React, { useState } from "react";

export const CreditsPurchase = () => {
  const [selectedPack, setSelectedPack] = useState<PackId | null>(
    PackId.MEDIUM
  );

  const mutation = useMutation({
    mutationFn: PurchaseCredits,
    onSuccess: () => {},
    onError: () => {},
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <CoinsIcon className="size-6 text-primary" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Select the number of credits you would like to purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => setSelectedPack(value as PackId)}
          value={selectedPack!}
        >
          {creditsPack.map((pack) => (
            <div
              key={pack.id}
              className="flex items-center space-x-4 bg-secondary/50 rounded-lg p-3 hover:bg-secondary"
              onClick={() => setSelectedPack(pack.id)}
            >
              <RadioGroupItem id={pack.id} value={pack.id} />
              <Label className="flex justify-between w-full cursor-pointer">
                <span className="font-medium">
                  {pack.name} - {pack.label}
                </span>
                <span className="font-bold text-primary">
                  ${(pack.price / 100).toFixed(2)} USD
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate(selectedPack!)}
        >
          <CreditCard className="mr-2" /> Purchase Credits
        </Button>
      </CardFooter>
    </Card>
  );
};
