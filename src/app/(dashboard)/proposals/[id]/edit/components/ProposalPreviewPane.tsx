'use client';

import { Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ProposalPreviewPaneProps {
  htmlContent: string;
  isLoading: boolean;
  isRendering: boolean;
  onRender: () => void;
  proposalTitle: string;
  error?: string | null;
}

export function ProposalPreviewPane({
  htmlContent,
  isLoading,
  isRendering,
  onRender,
  proposalTitle,
  error,
}: ProposalPreviewPaneProps) {
  const showLoading = isLoading || isRendering;

  return (
    <Card className="h-full flex flex-col" padding="none">
      <div className="px-4 py-3 border-b border-[#B87333]/30 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Preview</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRender}
          disabled={isRendering || isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isRendering ? 'animate-spin' : ''}`} />
          Render
        </Button>
      </div>

      <CardContent className="flex-1 p-0 overflow-hidden">
        {showLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400 mb-4" />
            <p className="text-sm text-slate-400">
              {isRendering ? 'Rendering preview...' : 'Loading preview...'}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="rounded-full bg-red-500/20 p-3 mb-4">
              <svg
                className="h-6 w-6 text-red-400"
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
            <h3 className="text-lg font-semibold text-white mb-2">Error Loading Preview</h3>
            <p className="text-sm text-slate-400 mb-4 text-center max-w-md">{error}</p>
            <Button variant="outline" size="sm" onClick={onRender}>
              Retry
            </Button>
          </div>
        ) : htmlContent ? (
          <div className="w-full h-full overflow-hidden bg-white">
            <iframe
              srcDoc={htmlContent}
              className="border-0 bg-white origin-top-left"
              style={{
                transform: 'scale(0.65)',
                width: '153.85%',
                height: '153.85%',
              }}
              title={`Preview of ${proposalTitle}`}
              sandbox="allow-same-origin"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <svg
              className="h-16 w-16 text-slate-500 mb-4"
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
            <p className="text-sm text-slate-400">No preview available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
