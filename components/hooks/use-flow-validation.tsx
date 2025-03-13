import { useContext } from "react";
import { FlowValidationContext } from "../context/flow-validation-context";

export default function UseFlowValidation() {
  const context = useContext(FlowValidationContext);
  if (!context) {
    throw new Error(
      "UseFlowValidation must be used within a FlowValidationContextProvider"
    );
  }

  return context;
}
