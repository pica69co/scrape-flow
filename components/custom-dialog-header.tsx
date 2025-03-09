"use client";

import React from "react";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "@/lib/utils";

interface CustomDialogHeaderProps {
  title?: string;
  subTitle?: string;
  icon?: React.ElementType; //  LucideIcon;

  iconClassName?: string;
  titleClassName?: string;
  subTitleClassName?: string;
}

export const CustomDialogHeader = (props: CustomDialogHeaderProps) => {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {props.icon && (
            <props.icon
              className={cn("stroke-emerald-600", props.iconClassName)}
              size={40}
            />
          )}
          {props.title && (
            <p
              className={cn(
                "text-xl text-emerald-500 font-bold text-center",
                props.titleClassName
              )}
            >
              {props.title}
            </p>
          )}
          {props.subTitle && (
            <p
              className={cn(
                "text-sm text-emerald-500 text-center",
                props.subTitleClassName
              )}
            >
              {props.subTitle}
            </p>
          )}
        </div>
      </DialogTitle>
    </DialogHeader>
  );
};
