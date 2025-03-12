"use client";
import React, { ReactNode } from "react";

export const NodeOutputs = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
};
