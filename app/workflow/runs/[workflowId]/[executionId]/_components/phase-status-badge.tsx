import { ExecutionPhaseStatus } from "@/types/workflow";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  Loader2Icon,
} from "lucide-react";

export default function PhaseStatusBadge({
  status,
}: {
  status: ExecutionPhaseStatus;
}) {
  switch (status) {
    case ExecutionPhaseStatus.PENDING:
      return <CircleDashedIcon size={20} className="stroke-muted-foreground" />;
    case ExecutionPhaseStatus.RUNNING:
      return (
        <Loader2Icon size={20} className="animate-spin stroke-yellow-500" />
      );
    case ExecutionPhaseStatus.FAILED:
      return <CircleAlertIcon size={20} className="stroke-red-500" />;
    case ExecutionPhaseStatus.COMPLETED:
      return <CircleCheckIcon size={20} className="stroke-green-500" />;
    default:
      return <div className="rounded-full">{status}</div>;
  }
}
