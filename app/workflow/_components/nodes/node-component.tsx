import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import NodeCard from "./node-card";
import { NodeHeader } from "./node-header";
import { AppNodeData } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow-tasks/task/registry";
import { NodeInputs } from "./node-inputs";
import { NodeInput } from "./node-input";

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const task = TaskRegistry[nodeData.type];
  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      <NodeHeader taskType={nodeData.type} />
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput key={input.name} input={input} nodeId={props.id} />
        ))}
      </NodeInputs>
    </NodeCard>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
