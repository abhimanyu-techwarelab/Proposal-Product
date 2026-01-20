'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { proposalsApi } from '@/lib/api/proposals';
import { Proposal } from '@/types';
import { generateId } from '@/lib/utils';
import { ProposalPreviewPane } from './components/ProposalPreviewPane';
import {
  ProposalEditForm,
  EditableFields,
  MilestoneItem,
  TeamMemberItem,
  RecipientItem,
} from './components/ProposalEditForm';

interface ProposalEditPageProps {
  params: Promise<{ id: string }>;
}

// Helper to parse string array from backend
const parseStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string') as string[];
  }
  return [];
};

// Helper to parse object array from backend
const parseObjectArray = <T extends { id: string }>(
  value: unknown,
  mapFn: (item: Record<string, unknown>) => T
): T[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return mapFn(item as Record<string, unknown>);
      }
      return mapFn({});
    });
  }
  return [];
};

// Helper to parse submitted_to from backend (string[] like "Mr. John Smith")
const parseSubmittedTo = (value: unknown): RecipientItem[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === 'string') {
        // Parse "Mr. John Smith" format
        const match = item.match(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*(.*)$/);
        if (match) {
          return {
            id: generateId(),
            salutation: match[1],
            name: match[2].trim(),
          };
        }
        // No salutation found, treat as name only
        return {
          id: generateId(),
          salutation: '',
          name: item,
        };
      }
      // If it's already an object (from previous edit)
      if (typeof item === 'object' && item !== null) {
        const obj = item as Record<string, unknown>;
        return {
          id: (obj.id as string) || generateId(),
          salutation: (obj.salutation as string) || '',
          name: (obj.name as string) || '',
        };
      }
      return { id: generateId(), salutation: '', name: '' };
    });
  }
  return [];
};

export default function ProposalEditPage({ params }: ProposalEditPageProps) {
  const { id } = use(params);
  const router = useRouter();

  // State management
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [formData, setFormData] = useState<EditableFields>({
    // Basic Info
    title: '',
    client_name: '',
    client_email: '',
    industry: '',

    // Content - Text Fields
    executive_summary: '',
    objectives: '',
    training_and_support: '',
    scope_of_work_introduction: '',
    scope_of_work_summary: '',
    scope_of_work: '',
    summary: '',
    goals: '',
    scope: '',

    // Dates
    start_date: '',
    end_date: '',
    date_of_proposal: '',
    duration_business_days: 0,

    // Budget
    total_budget: 0,
    currency: '',
    billing_type: '',

    // Simple string arrays
    deliverables: [],
    links: [],

    // Structured Array Fields
    milestones: [],
    team_members: [],
    submitted_to: [],
  });
  const [originalFormData, setOriginalFormData] = useState<EditableFields | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRendering, setIsRendering] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch proposal data and preview on mount
  useEffect(() => {
    fetchProposalAndPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Track changes
  useEffect(() => {
    if (originalFormData) {
      const changed = JSON.stringify(formData) !== JSON.stringify(originalFormData);
      setHasChanges(changed);
    }
  }, [formData, originalFormData]);

  const fetchProposalAndPreview = async () => {
    setIsLoading(true);
    setError(null);
    setPreviewError(null);

    try {
      // Fetch proposal data
      const proposalResponse = await proposalsApi.getById(id);

      // Handle both wrapped (ApiResponse) and direct response formats
      const proposalData =
        proposalResponse.success && proposalResponse.data
          ? proposalResponse.data
          : (proposalResponse as unknown as Proposal);

      if (proposalData && proposalData.id) {
        setProposal(proposalData);

        // Cast to access all possible fields from backend
        const data = proposalData as unknown as Record<string, unknown>;

        const initialFormData: EditableFields = {
          // Basic Info
          title: (data.title as string) || '',
          client_name: (data.client_name as string) || '',
          client_email: (data.client_email as string) || '',
          industry: (data.industry as string) || '',

          // Content - Text Fields
          executive_summary: (data.executive_summary as string) || '',
          objectives: (data.objectives as string) || '',
          training_and_support: (data.training_and_support as string) || '',
          scope_of_work_introduction: (data.scope_of_work_introduction as string) || '',
          scope_of_work_summary: (data.scope_of_work_summary as string) || '',
          scope_of_work: (data.scope_of_work as string) || '',
          summary: (data.summary as string) || '',
          goals: (data.goals as string) || '',
          scope: (data.scope as string) || '',

          // Dates
          start_date: (data.start_date as string) || '',
          end_date: (data.end_date as string) || '',
          date_of_proposal: (data.date_of_proposal as string) || '',
          duration_business_days: (data.duration_business_days as number) || 0,

          // Budget
          total_budget: (data.total_budget as number) || 0,
          currency: (data.currency as string) || '',
          billing_type: (data.billing_type as string) || '',

          // Simple string arrays - parse from backend
          deliverables: parseStringArray(data.deliverables),
          links: parseStringArray(data.links),

          // Structured Array Fields - parse from backend
          milestones: parseObjectArray<MilestoneItem>(
            data.milestones,
            (item) => ({
              id: (item.id as string) || generateId(),
              title: (item.title as string) || '',
            })
          ),
          team_members: parseObjectArray<TeamMemberItem>(
            data.team_members,
            (item) => ({
              id: (item.id as string) || generateId(),
              role: (item.role as string) || '',
              experience: (item.experience as string) || '',
            })
          ),
          submitted_to: parseSubmittedTo(data.submitted_to),
        };

        setFormData(initialFormData);
        setOriginalFormData(initialFormData);

        // Fetch initial preview
        try {
          const previewResponse = await proposalsApi.getPreview(id);
          const html =
            previewResponse.success && previewResponse.data
              ? previewResponse.data.html
              : (previewResponse as unknown as { html: string }).html;

          if (html) {
            setHtmlContent(html);
          } else {
            setPreviewError('No preview content available');
          }
        } catch (previewErr) {
          console.error('Error fetching preview:', previewErr);
          setPreviewError(
            previewErr instanceof Error ? previewErr.message : 'Failed to load preview'
          );
        }
      } else {
        throw new Error('Proposal not found or invalid response format');
      }
    } catch (err: unknown) {
      console.error('Error fetching proposal:', err);
      let errorMessage = 'Failed to load proposal';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = String((err as { message: unknown }).message);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRender = async () => {
    setIsRendering(true);
    setPreviewError(null);

    try {
      const response = await proposalsApi.getPreview(id);
      const html =
        response.success && response.data
          ? response.data.html
          : (response as unknown as { html: string }).html;

      if (html) {
        setHtmlContent(html);
      } else {
        throw new Error('No preview content received');
      }
    } catch (err) {
      console.error('Error rendering preview:', err);
      setPreviewError(err instanceof Error ? err.message : 'Failed to render preview');
    } finally {
      setIsRendering(false);
    }
  };

  const handleFieldChange = (field: keyof EditableFields, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Build update payload
      const updatePayload: Record<string, unknown> = {
        id,
        // Basic Info
        title: formData.title,
        client_name: formData.client_name,
        client_email: formData.client_email,
        industry: formData.industry,

        // Content - Text Fields
        executive_summary: formData.executive_summary,
        objectives: formData.objectives,
        training_and_support: formData.training_and_support,
        scope_of_work_introduction: formData.scope_of_work_introduction,
        scope_of_work_summary: formData.scope_of_work_summary,
        scope_of_work: formData.scope_of_work,
        summary: formData.summary,
        goals: formData.goals,
        scope: formData.scope,

        // Dates
        start_date: formData.start_date,
        end_date: formData.end_date,
        date_of_proposal: formData.date_of_proposal,
        duration_business_days: formData.duration_business_days,

        // Budget
        total_budget: formData.total_budget,
        currency: formData.currency,
        billing_type: formData.billing_type,

        // Simple string arrays - send as-is
        deliverables: formData.deliverables,
        links: formData.links,

        // Structured Array Fields - strip internal IDs and format for backend
        milestones: formData.milestones.map(({ id: _id, ...rest }) => rest),
        team_members: formData.team_members.map(({ id: _id, ...rest }) => rest),
        // submitted_to needs to be combined back to "Mr. John Smith" format
        submitted_to: formData.submitted_to.map((r) =>
          r.salutation && r.name ? `${r.salutation} ${r.name}` : r.name || ''
        ),
      };

      const response = await proposalsApi.update(
        updatePayload as unknown as Parameters<typeof proposalsApi.update>[0]
      );

      // Handle both wrapped (ApiResponse) and direct response formats
      const responseData =
        response.success !== undefined ? response : { success: true, data: response };

      if (responseData.success || responseData.data) {
        router.push(`/proposals/${id}`);
      } else {
        throw new Error('Failed to save changes');
      }
    } catch (err) {
      console.error('Error saving proposal:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/proposals/${id}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading proposal...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !proposal) {
    return (
      <div className="mx-auto max-w-md mt-20">
        <Card>
          <CardContent className="text-center py-8">
            <div className="rounded-full bg-red-500/20 p-3 w-fit mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Error Loading Proposal</h3>
            <p className="text-slate-400 mb-4">{error || 'Proposal not found'}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push('/proposals')}>
                Back to List
              </Button>
              <Button onClick={fetchProposalAndPreview}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {/* Back navigation */}
      <div className="mb-2">
        <Link
          href={`/proposals/${id}`}
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-300"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Proposal
        </Link>
      </div>

      {/* Page header */}
      <PageHeader
        title={`Edit: ${proposal.title}`}
        description={`${proposal.pdf_code} - Editing proposal content`}
      />

      {/* Split-pane layout */}
      <div className="flex flex-col lg:flex-row gap-6 mt-4" style={{ height: 'calc(100vh - 160px)' }}>
        {/* Left: Preview Pane (65%) */}
        <div className="lg:w-[65%] h-[70vh] lg:h-full">
          <ProposalPreviewPane
            htmlContent={htmlContent}
            isLoading={false}
            isRendering={isRendering}
            onRender={handleRender}
            proposalTitle={proposal.title}
            error={previewError}
          />
        </div>

        {/* Right: Edit Form (35%) */}
        <div className="lg:w-[35%] h-auto lg:h-full">
          <ProposalEditForm
            formData={formData}
            onChange={handleFieldChange}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
            hasChanges={hasChanges}
            saveError={saveError}
          />
        </div>
      </div>
    </div>
  );
}
