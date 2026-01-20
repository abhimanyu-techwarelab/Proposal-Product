"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { proposalsApi } from "@/lib/api/proposals";

interface ProposalPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  proposalTitle: string;
  footerActions?: React.ReactNode;
}

export function ProposalPreviewModal({
  isOpen,
  onClose,
  proposalId,
  proposalTitle,
  footerActions,
}: ProposalPreviewModalProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && proposalId) {
      fetchProposalPreview();
    } else {
      // Reset state when modal closes
      setHtmlContent("");
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, proposalId]);

  const fetchProposalPreview = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call GET /product/proposals/:id/render endpoint via API
      const response = await proposalsApi.getPreview(proposalId);

      // Handle both wrapped (ApiResponse) and direct response formats
      const html =
        response.success && response.data
          ? response.data.html
          : (response as any).html;

      if (!html) {
        throw new Error("No HTML content received from server");
      }

      setHtmlContent(html);
    } catch (err) {
      console.error("Error fetching proposal preview:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load proposal preview"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={proposalTitle}
      size="full"
      className="w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-[62rem] mx-auto"
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Content Container */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 sm:py-6 scrollbar-thin">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-slate-400 mb-3 sm:mb-4" />
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Loading proposal preview...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-2 sm:p-3 mb-3 sm:mb-4">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Error Loading Preview
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-md">
                {error}
              </p>
              <Button
                onClick={fetchProposalPreview}
                variant="outline"
                size="sm"
              >
                Retry
              </Button>
            </div>
          ) : htmlContent ? (
            <div className="w-full h-[55vh] overflow-hidden bg-white rounded-lg">
              <iframe
                srcDoc={htmlContent}
                className="border-0 bg-white origin-top-left"
                title={`Preview of ${proposalTitle}`}
                sandbox="allow-same-origin"
                style={{
                  transform: "scale(0.65)",
                  width: "153.85%",
                  height: "153.85%",
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
              <svg
                className="h-12 w-12 sm:h-16 sm:w-16 text-slate-400 dark:text-slate-500 mb-3 sm:mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-md">
                No preview available for this proposal.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {footerActions && (
          <div className="flex items-center justify-end gap-3 border-t border-[#B87333]/30 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
            {footerActions}
          </div>
        )}
      </div>
    </Modal>
  );
}
