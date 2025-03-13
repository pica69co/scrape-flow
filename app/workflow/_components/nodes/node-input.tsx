import React from "react";
import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import { NodeParamField } from "./node-param-field";
import { ColorForHandle } from "./common";
import UseFlowValidation from "@/components/hooks/use-flow-validation";
export const NodeInput = ({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) => {
  const { invalidInputs } = UseFlowValidation();
  const hasErrors = invalidInputs
    .find((node) => node.nodeId === nodeId)
    ?.inputs.find((invalidInput) => invalidInput === input.name);

  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );

  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-slate-200/50 w-full",
        hasErrors && "bg-red-300"
      )}
    >
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected} // Disable connection if already connected
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
            ColorForHandle[input.type]
          )}
        />
      )}
    </div>
  );
};
