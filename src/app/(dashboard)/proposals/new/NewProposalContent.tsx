"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { ProposalForm } from "@/components/forms/ProposalForm";
import { TemplateSelectionModal } from "@/components/templates";
import { proposalsApi } from "@/lib/api/proposals";

export function NewProposalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateIdFromUrl = searchParams.get("template_id");
  const draftId = searchParams.get("draft_id");

  // Track the effective template ID (from URL or loaded from draft)
  const [templateId, setTemplateId] = useState<string | null>(templateIdFromUrl);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);

  // Modal is shown if no template selected AND not loading a draft
  const [showTemplateModal, setShowTemplateModal] = useState(!templateIdFromUrl && !draftId);

  // Load draft's template_id when editing a draft without template_id in URL
  useEffect(() => {
    if (draftId && !templateIdFromUrl) {
      setIsLoadingDraft(true);
      proposalsApi.getById(draftId)
        .then(response => {
          if (response.success && response.data) {
            const draft = response.data as any;
            if (draft.template_id) {
              setTemplateId(draft.template_id);
              // Update URL to include template_id for consistency
              router.replace(`/proposals/new?template_id=${draft.template_id}&draft_id=${draftId}`);
            } else {
              // No template_id on draft, show template selection
              setShowTemplateModal(true);
            }
          }
        })
        .catch(err => {
          console.error('Failed to load draft:', err);
          setShowTemplateModal(true);
        })
        .finally(() => setIsLoadingDraft(false));
    }
  }, [draftId, templateIdFromUrl, router]);

  // Update templateId state when URL changes
  useEffect(() => {
    if (templateIdFromUrl) {
      setTemplateId(templateIdFromUrl);
      setShowTemplateModal(false);
    }
  }, [templateIdFromUrl]);

  const handleTemplateSelect = (selectedId: string) => {
    const url = draftId
      ? `/proposals/new?template_id=${selectedId}&draft_id=${draftId}`
      : `/proposals/new?template_id=${selectedId}`;
    router.push(url);
    setTemplateId(selectedId);
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

  // Loading state while fetching draft
  if (isLoadingDraft) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="Edit Draft Proposal"
          description="Loading draft..."
          breadcrumbs={[
            { label: "Proposals", href: "/proposals" },
            { label: "Edit Draft" },
          ]}
        />
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading draft...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={draftId ? "Edit Draft Proposal" : "Create New Proposal"}
        description={draftId
          ? "Continue editing your draft proposal"
          : "Fill in the details below to create a professional proposal"}
        breadcrumbs={[
          { label: "Proposals", href: "/proposals" },
          { label: draftId ? "Edit Draft" : "New Proposal" },
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
