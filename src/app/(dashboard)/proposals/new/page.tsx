import { Metadata } from "next";
import { Suspense } from "react";
import { NewProposalContent } from "./NewProposalContent";

export const metadata: Metadata = {
  title: "Create Proposal - ProposalGen",
  description: "Create a new professional proposal",
};

export default function NewProposalPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-slate-400">Loading...</div>}>
      <NewProposalContent />
    </Suspense>
  );
}
