"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout";
import { ProposalForm } from "@/components/forms/ProposalForm";
import { TemplateSelectionModal } from "@/components/templates";

export function NewProposalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("template_id");

  // Modal is always shown if no template selected - user cannot skip
  const [showTemplateModal, setShowTemplateModal] = useState(!templateId);

  const handleTemplateSelect = (selectedId: string) => {
    router.push(`/proposals/new?template_id=${selectedId}`);
    setShowTemplateModal(false);
  };

  const handleChangeTemplate = () => {
    setShowTemplateModal(true);
  };

  // If no template selected, redirect back to dashboard
  const handleCloseModal = () => {
    if (!templateId) {
      router.push("/dashboard");
    } else {
      setShowTemplateModal(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Create New Proposal"
        description="Fill in the details below to create a professional proposal"
        breadcrumbs={[
          { label: "Proposals", href: "/proposals" },
          { label: "New Proposal" },
        ]}
      />

      <TemplateSelectionModal
        isOpen={showTemplateModal}
        onClose={handleCloseModal}
        onSelect={handleTemplateSelect}
      />

      {/* Only show form if template is selected */}
      {templateId ? (
        <ProposalForm
          templateId={templateId}
          onChangeTemplate={handleChangeTemplate}
        />
      ) : (
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-400">Please select a template to continue...</p>
        </div>
      )}
    </div>
  );
}
