"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Template } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { FileText } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm",
        "p-4 text-left transition-all duration-200",
        "hover:border-[#B87333]/60 hover:bg-slate-800/60",
        "focus:outline-none focus:ring-2 focus:ring-[#B87333]/50 focus:ring-offset-2 focus:ring-offset-slate-900"
      )}
    >
      {/* Preview Image / Placeholder */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-800/50 border border-slate-700/50 mb-4">
        {template.preview_image ? (
          <img
            src={template.preview_image}
            alt={template.name}
            className="h-full w-full object-cover object-top"
          />
        ) : template.content?.summary ? (
          <div className="h-full p-3 overflow-hidden">
            <div className="text-[10px] text-slate-500 leading-relaxed line-clamp-6">
              {template.content.summary}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="h-12 w-12 text-slate-600" />
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white group-hover:text-[#DA8A67] transition-colors line-clamp-1">
            {template.name}
          </h3>
          {template.is_default && (
            <Badge variant="primary" size="sm">
              Default
            </Badge>
          )}
        </div>
        {template.description && (
          <p className="text-sm text-slate-400 line-clamp-2">
            {template.description}
          </p>
        )}
      </div>
    </button>
  );
}
