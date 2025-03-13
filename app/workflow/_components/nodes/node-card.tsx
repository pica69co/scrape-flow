"use client";

import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { ReactNode } from "react";
import UseFlowValidation from "@/components/hooks/use-flow-validation";

const NodeCard = ({
  nodeId,
  isSelected,
  children,
}: {
  nodeId: string;
  isSelected: boolean;
  children: ReactNode;
}) => {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = UseFlowValidation();
  const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);

  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;
        const { width, height } = measured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;
        if (x === undefined || y === undefined) return;
        setCenter(x, y, {
          zoom: 1,
          duration: 500,
        });
      }}
      className={cn(
        "rounded-md cursor-pointer bg-emerald-100/50  border-2 border-separate w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-emerald-500",
        hasInvalidInputs && "border-red-400 border-2"
      )}
    >
      {children}
    </div>
  );
};

export default NodeCard;
