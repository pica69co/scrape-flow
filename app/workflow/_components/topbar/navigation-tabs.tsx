"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const NavigationTabs = ({ workflowId }: { workflowId: string }) => {
  const pathname = usePathname();
  const activeValue = pathname.split("/")[2];
  return (
    <Tabs value={activeValue} className="w-[400px]">
      <TabsList className="w-full grid grid-cols-2">
        <Link href={`/workflow/editor/${workflowId}`}>
          <TabsTrigger value="editor" className="w-full cursor-pointer">
            Editor
          </TabsTrigger>
        </Link>

        <Link href={`/workflow/runs/${workflowId}`}>
          <TabsTrigger value="runs" className="w-full cursor-pointer">
            Runs
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
};
