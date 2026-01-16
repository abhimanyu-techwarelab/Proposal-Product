"use client";

import React from "react";
import { Template } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Check, FileText } from "lucide-react";

interface TemplatePreviewProps {
  template: Template;
  onBack: () => void;
  onSelect: () => void;
}

export function TemplatePreview({ template, onBack, onSelect }: TemplatePreviewProps) {
  return (
    <div className="flex flex-col h-[75vh] max-h-[750px]">
      {/* Header - No Select button here */}
      <div className="flex items-center gap-4 border-b border-[#B87333]/30 pb-3 mb-3 flex-shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Back to templates"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">{template.name}</h2>
            {template.is_default && (
              <Badge variant="primary" size="sm">
                Default
              </Badge>
            )}
          </div>
          {template.description && (
            <p className="mt-1 text-sm text-slate-400">{template.description}</p>
          )}
        </div>
      </div>

      {/* Rendered HTML Preview */}
      <div className="flex-1 overflow-hidden rounded-lg border border-[#B87333]/20 bg-white min-h-0">
        {template.html && template.html.trim() ? (
          <iframe
            srcDoc={template.html}
            className="w-full h-full border-0"
            sandbox="allow-same-origin"
            title="Template Preview"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center bg-slate-800/50">
            <FileText className="h-10 w-10 text-slate-600 mb-3" />
            <p className="text-slate-400">This template has no HTML content.</p>
            <p className="text-sm text-slate-500 mt-1">You can still use it as a starting point.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#B87333]/30 pt-3 mt-3 flex-shrink-0">
        <Button variant="outline" onClick={onBack}>
          Change Template
        </Button>
        <Button onClick={onSelect} leftIcon={<Check className="h-4 w-4" />}>
          Select Template
        </Button>
      </div>
    </div>
  );
}
