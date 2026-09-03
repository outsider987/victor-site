import type { Metadata } from "next";
import { AgentProcess } from "@/components/case-study";

export const metadata: Metadata = {
  title: "AI Delivery Process",
  description: "Victor Chang's evidence-driven workflow for taking AI-assisted changes from a clear brief to verified code.",
};

export default function ProcessPage() {
  return <AgentProcess />;
}
