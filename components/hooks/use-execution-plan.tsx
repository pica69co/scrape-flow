import {
  FlowToExecutionPlan,
  FlowToExecutionPlanValidationErrorType,
} from "@/lib/workflow-tasks/execution-plan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import UseFlowValidation from "./use-flow-validation";
import { toast } from "sonner";

const UseExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = UseFlowValidation();

  const handleError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationErrorType.NO_ENTRY_POINT:
          toast.error("No entry point found in the flow.");
          break;
        case FlowToExecutionPlanValidationErrorType.INVALID_INPUTS:
          toast.error("Not all inputs values are set.");
          setInvalidInputs(error.invalidElements);
          break;
        default:
          toast.error("An unknown error occurred.");
          break;
      }
    },
    [setInvalidInputs]
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(
      nodes as AppNode[],
      edges
    );

    if (error) {
      // Handle errors based on the type
      handleError(error);
      return null;
    }
    // Clear previous errors
    clearErrors();
    return executionPlan;
  }, [toObject, handleError, clearErrors]);

  return generateExecutionPlan;
};

export default UseExecutionPlan;
