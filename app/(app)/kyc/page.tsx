import { redirect } from "next/navigation";
import { CURRENT_MILESTONE } from "@/lib/constants/milestones";

export default function KycPage() {
  if (CURRENT_MILESTONE < 2) {
    redirect("/overview");
  }

  return null;
}
