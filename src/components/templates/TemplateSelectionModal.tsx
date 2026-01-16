"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Loading";
import { Template } from "@/types";
import { templatesApi } from "@/lib/api";
import { TemplateCard } from "./TemplateCard";
import { TemplatePreview } from "./TemplatePreview";
import { AlertCircle, RefreshCw, FileText } from "lucide-react";

type ModalView = "grid" | "preview";

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

export function TemplateSelectionModal({
  isOpen,
  onClose,
  onSelect,
}: TemplateSelectionModalProps) {
  const [view, setView] = useState<ModalView>("grid");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setView("grid");
      setSelectedTemplate(null);
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await templatesApi.list();
      if (response.success && response.data) {
        setTemplates(response.data.templates || []);
      } else {
        setError("Failed to load templates");
      }
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError("Failed to load templates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = async (template: Template) => {
    try {
      setLoadingPreview(true);
      // Fetch full template details including HTML
      const response = await templatesApi.getById(template.id);
      if (response.success && response.data) {
        setSelectedTemplate(response.data);
        setView("preview");
      } else {
        console.error("Failed to fetch template details");
      }
    } catch (err) {
      console.error("Error fetching template details:", err);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleBack = () => {
    setView("grid");
    setSelectedTemplate(null);
  };

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate.id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={view === "grid" ? "Choose a Template" : undefined}
      description={view === "grid" ? "Select a template to get started quickly" : undefined}
      size="full"
      closeOnOverlayClick={false}
    >
      <div className="min-h-[400px]">
        {view === "grid" ? (
          <>
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl border border-[#B87333]/30 bg-slate-900/60 p-4">
                    <Skeleton className="aspect-[4/3] w-full rounded-lg mb-4" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-danger-500/10 p-4 mb-4">
                  <AlertCircle className="h-8 w-8 text-danger-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Templates</h3>
                <p className="text-sm text-slate-400 mb-4">{error}</p>
                <Button
                  variant="outline"
                  onClick={fetchTemplates}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && templates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-slate-800 p-4 mb-4">
                  <FileText className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Templates Available</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Please contact your administrator to create templates.
                </p>
                <Button variant="outline" onClick={onClose}>
                  Go Back
                </Button>
              </div>
            )}

            {/* Templates Grid */}
            {!loading && !error && templates.length > 0 && (
              <div className="relative">
                {loadingPreview && (
                  <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center z-10 rounded-lg">
                    <div className="flex items-center gap-2 text-white">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Loading preview...</span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onClick={() => handleTemplateClick(template)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Preview View */
          selectedTemplate && (
            <TemplatePreview
              template={selectedTemplate}
              onBack={handleBack}
              onSelect={handleSelect}
            />
          )
        )}
      </div>
    </Modal>
  );
}
