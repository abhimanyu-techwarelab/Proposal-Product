'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, GripVertical, Upload, FileText, Music, X, RefreshCw, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardContent,
  DatePicker,
} from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { proposalsApi, templatesApi, subscriptionsApi, ApiRequestError } from '@/lib/api';
import { insertProposal } from '@/lib/api/supabaseProposals';
import { proposalCreateSchema } from '@/lib/validations';
import { generateId } from '@/lib/utils';
import { supabase } from '@/lib/api/supabaseClient';
import {
  generateAllSignedUrls,
  STORAGE_BUCKETS,
} from '@/lib/storage';
import {
  Currency,
  BillingType,
  Deliverable,
  Milestone,
  TeamMember,
  ProposalLink,
  Recipient,
  Template,
} from '@/types';
import {
  CURRENCY_CONFIG,
  BILLING_TYPE_CONFIG,
  INDUSTRY_OPTIONS,
} from '@/constants';
import { Modal } from '@/components/ui/Modal';
import { TemplatePreview } from '@/components/templates/TemplatePreview';

// ============================================================================
// File Upload Types & Constants
// ============================================================================

interface PendingFile {
  id: string;
  name: string;
  file: File;
  size: number;
}

interface UploadedFile {
  id: string;
  name: string;
  path: string;
  url: string;
  size: number;
}

const DOCUMENT_ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const AUDIO_ACCEPT = '.mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/x-m4a,audio/mp4';

// ============================================================================
// Types
// ============================================================================

interface FormErrors {
  [key: string]: string | undefined;
}

interface DeliverableInput extends Omit<Deliverable, 'id'> {
  id: string;
}

interface MilestoneInput extends Omit<Milestone, 'id'> {
  id: string;
}

interface TeamMemberInput extends Omit<TeamMember, 'id'> {
  id: string;
}

interface LinkInput extends Omit<ProposalLink, 'id'> {
  id: string;
}

interface RecipientInput extends Omit<Recipient, 'id'> {
  id: string;
}

// ============================================================================
// Initial Values
// ============================================================================

const getInitialDeliverable = (): DeliverableInput => ({
  id: generateId(),
  title: '',
  description: '',
  due_date: '',
});

const getInitialMilestone = (): MilestoneInput => ({
  id: generateId(),
  title: '',
});

const getInitialTeamMember = (): TeamMemberInput => ({
  id: generateId(),
  role: '',
  experience: '',
});

const getInitialRecipient = (): RecipientInput => ({
  id: generateId(),
  salutation: '',
  name: '',
});

const getInitialLink = (): LinkInput => ({
  id: generateId(),
  label: '',
  url: '',
});

// ============================================================================
// Component Props
// ============================================================================

interface ProposalFormProps {
  templateId?: string | null;
  onChangeTemplate?: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function ProposalForm({ templateId, onChangeTemplate }: ProposalFormProps) {
  const router = useRouter();
  const { productUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Template state
  const [loadedTemplate, setLoadedTemplate] = useState<Template | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Loader modal state
  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState<'uploading' | 'generating' | 'pending'>('uploading');

  // File upload refs and state (files stored locally until submit)
  const documentInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [pendingDocuments, setPendingDocuments] = useState<PendingFile[]>([]);
  const [pendingAudio, setPendingAudio] = useState<PendingFile[]>([]);
  const [isAddingDocuments, setIsAddingDocuments] = useState(false);
  const [isAddingAudio, setIsAddingAudio] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [industry, setIndustry] = useState('');
  const [summary, setSummary] = useState('');
  const [goals, setGoals] = useState('');
  const [scope, setScope] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateOfProposal, setDateOfProposal] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const [billingType, setBillingType] = useState<BillingType>(BillingType.FIXED);
  const [recipients, setRecipients] = useState<RecipientInput[]>([]);

  // Array fields - simplified string arrays for deliverables and links
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [deliverableInput, setDeliverableInput] = useState('');
  const [milestones, setMilestones] = useState<MilestoneInput[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberInput[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState('');

  // ============================================================================
  // Template Loading
  // ============================================================================

  useEffect(() => {
    if (templateId) {
      loadTemplateData(templateId);
    } else {
      setLoadedTemplate(null);
    }
  }, [templateId]);

  const loadTemplateData = async (id: string) => {
    try {
      setIsLoadingTemplate(true);
      const response = await templatesApi.getById(id);

      if (response.success && response.data) {
        const template = response.data;
        setLoadedTemplate(template);

        // Pre-fill form fields from template content
        const content = template.content;
        if (content) {
          if (content.title) setTitle(content.title);
          if (content.client_name) setClientName(content.client_name);
          if (content.client_email) setClientEmail(content.client_email);
          if (content.industry) setIndustry(content.industry);
          if (content.summary) setSummary(content.summary);
          if (content.goals) setGoals(content.goals);
          if (content.scope) setScope(content.scope);
          if (content.start_date) setStartDate(content.start_date);
          if (content.end_date) setEndDate(content.end_date);
          if (content.total_budget) setTotalBudget(content.total_budget);
          if (content.currency) setCurrency(content.currency);
          if (content.billing_type) setBillingType(content.billing_type);

          // Pre-fill deliverables (as string array)
          if (content.deliverables && content.deliverables.length > 0) {
            setDeliverables(
              content.deliverables.map((d) => d.title || '')
            );
          }

          // Pre-fill milestones
          if (content.milestones && content.milestones.length > 0) {
            setMilestones(
              content.milestones.map((m) => ({
                id: generateId(),
                title: m.title || '',
              }))
            );
          }

          // Pre-fill team members
          if (content.team_members && content.team_members.length > 0) {
            setTeamMembers(
              content.team_members.map((t) => ({
                id: generateId(),
                role: t.role || '',
                experience: t.experience || '',
              }))
            );
          }

          // Pre-fill links (as string array)
          if (content.links && content.links.length > 0) {
            setLinks(
              content.links.map((l) => l.url || '')
            );
          }

          // Pre-fill recipients
          if (content.submitted_to && content.submitted_to.length > 0) {
            setRecipients(
              content.submitted_to.map((r) => ({
                id: generateId(),
                salutation: r.salutation || '',
                name: r.name || '',
              }))
            );
          }
        }
      }
    } catch (error) {
      console.error('Failed to load template:', error);
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  // ============================================================================
  // File Upload Handlers
  // ============================================================================

  // Get storage path based on organization_id and user_id
  const getStoragePath = (fileName: string): string => {
    if (!productUser) {
      throw new Error('User not authenticated');
    }
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${generateId()}.${fileExt}`;
    return `${productUser.organization_id}/${productUser.user_id}/${uniqueFileName}`;
  };

  const uploadFileToSupabase = async (
    file: File,
    bucket: string
  ): Promise<{ path: string; url: string; error: string | null }> => {
    try {
      const filePath = getStoragePath(file.name);

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) {
        return { path: '', url: '', error: error.message };
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { path: filePath, url: urlData.publicUrl, error: null };
    } catch (err) {
      return { path: '', url: '', error: err instanceof Error ? err.message : 'Upload failed' };
    }
  };

  // Store files locally (upload happens on submit)
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setIsAddingDocuments(true);

    const newFiles: PendingFile[] = Array.from(files).map((file) => ({
      id: generateId(),
      name: file.name,
      file,
      size: file.size,
    }));

    // Show uploading state for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setPendingDocuments((prev) => [...prev, ...newFiles]);
    setIsAddingDocuments(false);

    // Reset input
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  // Store files locally (upload happens on submit)
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setIsAddingAudio(true);

    const newFiles: PendingFile[] = Array.from(files).map((file) => ({
      id: generateId(),
      name: file.name,
      file,
      size: file.size,
    }));

    // Show uploading state for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setPendingAudio((prev) => [...prev, ...newFiles]);
    setIsAddingAudio(false);

    // Reset input
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  const removeDocument = (fileId: string) => {
    setPendingDocuments((prev) => prev.filter((f) => f.id !== fileId));
  };

  const removeAudioFile = (fileId: string) => {
    setPendingAudio((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ============================================================================
  // Validation Helpers
  // ============================================================================

  const validateField = (field: string, value: string | number): boolean => {
    let error = '';

    switch (field) {
      case 'title':
        if (!value || String(value).length < 3) error = 'Title must be at least 3 characters';
        break;
      case 'client_name':
        if (!value) error = 'Client name is required';
        break;
      case 'client_email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)))
          error = 'Valid email is required';
        break;
      case 'start_date':
        if (!value) error = 'Start date is required';
        break;
      case 'end_date':
        if (!value) error = 'End date is required';
        break;
      case 'total_budget':
        if (value === undefined || Number(value) < 0) error = 'Budget must be positive';
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    return !error;
  };

  const validateSummaryGoalsScope = (): boolean => {
    if (!summary.trim() && !goals.trim() && !scope.trim()) {
      setErrors((prev) => ({
        ...prev,
        summary: 'At least one of Summary, Goals, or Scope is required',
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, summary: undefined }));
    return true;
  };

  const validateFileUploads = (): boolean => {
    if (pendingDocuments.length === 0 && pendingAudio.length === 0) {
      setUploadError('At least one document or audio file is required');
      return false;
    }
    setUploadError(null);
    return true;
  };

  const validateAllFields = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {};

    if (!title || title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
      isValid = false;
    }
    if (!clientName) {
      newErrors.client_name = 'Client name is required';
      isValid = false;
    }
    if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      newErrors.client_email = 'Valid email is required';
      isValid = false;
    }
    if (!startDate) {
      newErrors.start_date = 'Start date is required';
      isValid = false;
    }
    if (!endDate) {
      newErrors.end_date = 'End date is required';
      isValid = false;
    }
    if (totalBudget < 0) {
      newErrors.total_budget = 'Budget must be positive';
      isValid = false;
    }
    if (deliverables.length === 0) {
      newErrors.deliverables = 'At least one deliverable is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ============================================================================
  // Form Handlers
  // ============================================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    if (!productUser) {
      setSubmitError('You must be logged in to create a proposal');
      return;
    }

    // Validate all fields
    const isValid = validateAllFields();
    const hasSummaryGoalsScope = validateSummaryGoalsScope();
    const hasFiles = validateFileUploads();

    if (!isValid || !hasSummaryGoalsScope || !hasFiles) {
      return;
    }

    try {
      // Show loader modal
      setShowLoaderModal(true);
      setLoaderStatus('uploading');
      setIsSubmitting(true);

      // Step 1: Get active subscription
      const subscription = await subscriptionsApi.getActiveByOrganization(
        productUser.organization_id
      );

      // Step 2: Upload pending files to Supabase Storage
      const uploadedDocs: UploadedFile[] = [];
      const uploadedAudioFiles: UploadedFile[] = [];

      // Upload documents
      for (const pendingFile of pendingDocuments) {
        const { path, url, error } = await uploadFileToSupabase(
          pendingFile.file,
          STORAGE_BUCKETS.DOCUMENTS
        );
        if (error) {
          throw new Error(`Failed to upload ${pendingFile.name}: ${error}`);
        }
        uploadedDocs.push({
          id: pendingFile.id,
          name: pendingFile.name,
          path,
          url,
          size: pendingFile.size,
        });
      }

      // Upload audio files
      for (const pendingFile of pendingAudio) {
        const { path, url, error } = await uploadFileToSupabase(
          pendingFile.file,
          STORAGE_BUCKETS.AUDIO
        );
        if (error) {
          throw new Error(`Failed to upload ${pendingFile.name}: ${error}`);
        }
        uploadedAudioFiles.push({
          id: pendingFile.id,
          name: pendingFile.name,
          path,
          url,
          size: pendingFile.size,
        });
      }

      // Step 3: Generate signed URLs for uploaded files
      const documentPaths = uploadedDocs.map((f) => f.path);
      const audioPaths = uploadedAudioFiles.map((f) => f.path);

      const { documentUrls: signedDocUrls, audioUrls: signedAudioUrls, errors: signedUrlErrors } =
        await generateAllSignedUrls(documentPaths, audioPaths);

      if (signedUrlErrors.length > 0) {
        console.warn('Some signed URLs failed to generate:', signedUrlErrors);
      }

      setLoaderStatus('generating');

      // Step 4: Transform data for backend
      // Recipients: combine salutation and name into a single string
      const submittedTo = recipients.map((r) =>
        r.salutation && r.name ? `${r.salutation} ${r.name}` : r.name || ''
      );

      setLoaderStatus('pending');

      // Step 5: POST to backend generate endpoint
      const result = await proposalsApi.generate({
        subscription_id: subscription.id,
        template_id: templateId || undefined,
        created_by: productUser.id,
        submitted_to: submittedTo,
        title,
        client_name: clientName,
        client_email: clientEmail,
        industry: industry || '',
        summary: summary || '',
        goals: goals || '',
        scope: scope || '',
        start_date: startDate,
        end_date: endDate,
        date_of_proposal: dateOfProposal,
        total_budget: totalBudget,
        currency,
        billing_type: billingType,
        deliverables, // string[]
        milestones: milestones.map(({ id, ...m }) => m),
        team_members: teamMembers.map(({ id, ...t }) => t),
        links, // string[]
        document_storage_paths: signedDocUrls,
        audio_storage_paths: signedAudioUrls,
      });

      // Keep modal showing - user can click View Proposals to navigate
      // The modal will stay open showing "Pending" status

    } catch (error) {
      setShowLoaderModal(false);
      if (error instanceof ApiRequestError) {
        setSubmitError(error.message);
        if (error.details) {
          setErrors(
            Object.fromEntries(
              Object.entries(error.details).map(([key, msgs]) => [key, msgs[0]])
            )
          );
        }
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simplified deliverables handlers (string array)
  const addDeliverable = () => {
    if (deliverableInput.trim()) {
      setDeliverables([...deliverables, deliverableInput.trim()]);
      setDeliverableInput('');
      // Clear deliverables error if any
      setErrors((prev) => ({ ...prev, deliverables: undefined }));
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    setMilestones([...milestones, getInitialMilestone()]);
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const updateMilestone = (
    id: string,
    field: keyof MilestoneInput,
    value: string | number
  ) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, getInitialTeamMember()]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((t) => t.id !== id));
  };

  const updateTeamMember = (
    id: string,
    field: keyof TeamMemberInput,
    value: string | number | undefined
  ) => {
    setTeamMembers(
      teamMembers.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  // Simplified links handlers (string array)
  const addLink = () => {
    if (linkInput.trim()) {
      // Basic URL validation
      try {
        new URL(linkInput.trim());
        setLinks([...links, linkInput.trim()]);
        setLinkInput('');
        setErrors((prev) => ({ ...prev, linkInput: undefined }));
      } catch {
        setErrors((prev) => ({ ...prev, linkInput: 'Invalid URL format' }));
      }
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const addRecipient = () => {
    setRecipients([...recipients, getInitialRecipient()]);
  };

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter((r) => r.id !== id));
  };

  const updateRecipient = (
    id: string,
    field: keyof RecipientInput,
    value: string
  ) => {
    setRecipients(
      recipients.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Template Banner */}
      {loadedTemplate && (
        <div className="flex items-center justify-between rounded-lg border border-[#B87333]/30 bg-gradient-to-r from-[#B87333]/10 to-[#DA8A67]/5 p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#DA8A67]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Using template:</span>
                <span className="font-medium text-white">{loadedTemplate.name}</span>
                {loadedTemplate.is_default && (
                  <Badge variant="primary" size="sm">Default</Badge>
                )}
              </div>
              {loadedTemplate.description && (
                <p className="text-xs text-slate-500 mt-0.5">{loadedTemplate.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPreviewModal(true)}
              leftIcon={<Eye className="h-4 w-4" />}
            >
              View
            </Button>
            {onChangeTemplate && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onChangeTemplate}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Change Template
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {loadedTemplate && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          size="full"
        >
          <TemplatePreview
            template={loadedTemplate}
            onBack={() => setShowPreviewModal(false)}
            onSelect={() => setShowPreviewModal(false)}
          />
        </Modal>
      )}

      {/* Loader Modal */}
      <Modal
        isOpen={showLoaderModal}
        onClose={() => {}}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        showCloseButton={false}
        size="sm"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#B87333] border-t-transparent mb-4" />

          <h3 className="text-lg font-semibold text-white mb-2">
            {loaderStatus === 'uploading' && 'Uploading Documents...'}
            {loaderStatus === 'generating' && 'Generating Proposal...'}
            {loaderStatus === 'pending' && 'Processing...'}
          </h3>

          <p className="text-sm text-slate-400">
            Status:{' '}
            <span className="text-[#DA8A67] font-medium">
              {loaderStatus === 'uploading' && 'Uploading'}
              {loaderStatus === 'generating' && 'Generating'}
              {loaderStatus === 'pending' && 'Pending'}
            </span>
          </p>

          {/* Info message */}
          <p className="text-sm text-slate-500 mt-4 text-center max-w-sm">
            Your proposal will be available in the Proposals page once generated.
          </p>

          {/* View Proposals Button */}
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => router.push('/proposals')}
          >
            View Proposals
          </Button>
        </div>
      </Modal>

      {/* Template Loading State */}
      {isLoadingTemplate && (
        <div className="flex items-center justify-center rounded-lg border border-[#B87333]/30 bg-slate-800/30 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#B87333] border-t-transparent" />
            Loading template...
          </div>
        </div>
      )}

      {submitError && (
        <div className="rounded-lg bg-danger-500/20 border border-danger-500/30 p-4 text-sm text-danger-400">
          {submitError}
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="rounded-lg bg-danger-500/20 border border-danger-500/30 p-4 text-sm text-danger-400">
          {uploadError}
        </div>
      )}

      {/* File Uploads - Side by Side */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Document Upload */}
        <Card>
          <CardHeader
            title="Document Upload"
            description="PDF, DOC, DOCX"
          />
          <CardContent className="space-y-4">
            <input
              ref={documentInputRef}
              type="file"
              accept={DOCUMENT_ACCEPT}
              multiple
              onChange={handleDocumentUpload}
              className="hidden"
            />
            <div
              onClick={() => !isAddingDocuments && documentInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#B87333]/30 p-6 cursor-pointer hover:border-[#DA8A67] hover:bg-[#B87333]/10 transition-colors group ${isAddingDocuments ? 'opacity-70 cursor-wait' : ''}`}
            >
              <FileText className={`h-10 w-10 mb-2 transition-colors ${isAddingDocuments ? 'text-[#DA8A67] animate-pulse' : 'text-slate-400 group-hover:text-[#DA8A67]'}`} />
              <p className={`text-sm font-medium transition-colors ${isAddingDocuments ? 'text-[#DA8A67]' : 'text-slate-300 group-hover:text-[#DA8A67]'}`}>
                {isAddingDocuments ? 'Uploading...' : 'Click to upload'}
              </p>
            </div>
            {pendingDocuments.length > 0 && (
              <div className="space-y-2">
                {pendingDocuments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 rounded-lg border border-[#B87333]/30 bg-slate-800/50 p-3"
                  >
                    <FileText className="h-5 w-5 text-[#DA8A67] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(file.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-danger-400 flex-shrink-0 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audio Upload */}
        <Card>
          <CardHeader
            title="Audio Upload"
            description="MP3, WAV, M4A"
          />
          <CardContent className="space-y-4">
            <input
              ref={audioInputRef}
              type="file"
              accept={AUDIO_ACCEPT}
              multiple
              onChange={handleAudioUpload}
              className="hidden"
            />
            <div
              onClick={() => !isAddingAudio && audioInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#B87333]/30 p-6 cursor-pointer hover:border-[#DA8A67] hover:bg-[#B87333]/10 transition-colors group ${isAddingAudio ? 'opacity-70 cursor-wait' : ''}`}
            >
              <Music className={`h-10 w-10 mb-2 transition-colors ${isAddingAudio ? 'text-[#DA8A67] animate-pulse' : 'text-slate-400 group-hover:text-[#DA8A67]'}`} />
              <p className={`text-sm font-medium transition-colors ${isAddingAudio ? 'text-[#DA8A67]' : 'text-slate-300 group-hover:text-[#DA8A67]'}`}>
                {isAddingAudio ? 'Uploading...' : 'Click to upload'}
              </p>
            </div>
            {pendingAudio.length > 0 && (
              <div className="space-y-2">
                {pendingAudio.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 rounded-lg border border-[#B87333]/30 bg-slate-800/50 p-3"
                  >
                    <Music className="h-5 w-5 text-[#DA8A67] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAudioFile(file.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-danger-400 flex-shrink-0 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader title="Basic Information" description="Enter the proposal details" />
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Proposal Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => validateField('title', title)}
                error={errors.title}
                placeholder="e.g., Website Redesign Project"
                required
              />
            </div>
            <Input
              label="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              onBlur={() => validateField('client_name', clientName)}
              error={errors.client_name}
              placeholder="e.g., Acme Corporation"
              required
            />
            <Input
              label="Client Email"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              onBlur={() => validateField('client_email', clientEmail)}
              error={errors.client_email}
              placeholder="e.g., contact@acme.com"
              required
            />
            <Select
              label="Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              options={INDUSTRY_OPTIONS.map((ind) => ({ value: ind, label: ind }))}
              placeholder="Select industry"
            />
            <DatePicker
              label="Proposal Date"
              value={dateOfProposal}
              onChange={(value) => setDateOfProposal(value)}
              error={errors.date_of_proposal}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Project Description */}
      <Card>
        <CardHeader
          title="Project Description"
          description="Describe the project in detail"
        />
        <CardContent className="space-y-6">
          <Textarea
            label="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            error={errors.summary}
            placeholder="Brief overview of the project..."
            rows={3}
            required
          />
          <Textarea
            label="Goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            error={errors.goals}
            placeholder="What are the key objectives of this project?"
            rows={4}
            required
          />
          <Textarea
            label="Scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            error={errors.scope}
            placeholder="Define what is included and excluded from this project..."
            rows={4}
            required
          />
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader title="Timeline" description="Set the project schedule" />
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(value) => {
                setStartDate(value);
                validateField('start_date', value);
              }}
              error={errors.start_date}
              required
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(value) => {
                setEndDate(value);
                validateField('end_date', value);
              }}
              error={errors.end_date}
              minDate={startDate}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Budget */}
      <Card>
        <CardHeader title="Budget & Billing" description="Set the project budget" />
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <Input
              label="Total Budget"
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              onBlur={() => validateField('total_budget', totalBudget)}
              error={errors.total_budget}
              min={0}
              step={0.01}
              required
            />
            <Select
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              options={Object.entries(CURRENCY_CONFIG).map(([value, config]) => ({
                value,
                label: `${config.symbol} ${config.name}`,
              }))}
              required
            />
            <Select
              label="Billing Type"
              value={billingType}
              onChange={(e) => setBillingType(e.target.value as BillingType)}
              options={Object.entries(BILLING_TYPE_CONFIG).map(([value, config]) => ({
                value,
                label: config.label,
              }))}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Deliverables - Simplified string input */}
      <Card>
        <CardHeader
          title="Deliverables"
          description="List the project deliverables"
        />
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={deliverableInput}
                onChange={(e) => setDeliverableInput(e.target.value)}
                placeholder="Enter a deliverable"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addDeliverable();
                  }
                }}
              />
            </div>
            <Button type="button" variant="outline" onClick={addDeliverable}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
          {errors.deliverables && (
            <p className="text-sm text-danger-400">{errors.deliverables}</p>
          )}
          {deliverables.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {deliverables.map((deliverable, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg border border-[#B87333]/30 bg-slate-800/50 px-3 py-2"
                >
                  <span className="text-sm text-white">{deliverable}</span>
                  <button
                    type="button"
                    onClick={() => removeDeliverable(index)}
                    className="rounded p-0.5 text-slate-400 hover:text-danger-400 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {deliverables.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-2">
              No deliverables added. Enter a deliverable and click "Add".
            </p>
          )}
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader
          title="Milestones"
          description="Define milestones (optional)"
          action={
            <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          }
        />
        <CardContent className="space-y-4">
          {milestones.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              No milestones added. Click "Add" to create a milestone.
            </p>
          ) : (
            milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="flex gap-4 rounded-lg border border-[#B87333]/30 bg-slate-800/30 p-4"
              >
                <div className="flex items-center text-slate-400">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <Input
                    label="Title"
                    value={milestone.title}
                    onChange={(e) =>
                      updateMilestone(milestone.id, 'title', e.target.value)
                    }
                    error={errors[`milestones.${index}.title`]}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeMilestone(milestone.id)}
                  className="self-center rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-danger-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader
          title="Team Members"
          description="Add team members working on this project (optional)"
          action={
            <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          }
        />
        <CardContent className="space-y-4">
          {teamMembers.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              No team members added. Click "Add" to add a team member.
            </p>
          ) : (
            teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="flex gap-4 rounded-lg border border-[#B87333]/30 bg-slate-800/30 p-4"
              >
                <div className="flex-1 grid gap-4 md:grid-cols-2">
                  <Input
                    label="Role"
                    value={member.role}
                    onChange={(e) =>
                      updateTeamMember(member.id, 'role', e.target.value)
                    }
                    error={errors[`team_members.${index}.role`]}
                    placeholder="e.g., Lead Developer"
                    required
                  />
                  <Input
                    label="Experience"
                    value={member.experience}
                    onChange={(e) =>
                      updateTeamMember(member.id, 'experience', e.target.value)
                    }
                    error={errors[`team_members.${index}.experience`]}
                    placeholder="e.g., 5 years or Senior level"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeTeamMember(member.id)}
                  className="self-center rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-danger-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Links - Simplified URL input */}
      <Card>
        <CardHeader
          title="Reference Links"
          description="Add relevant links (optional)"
        />
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="https://example.com"
                error={errors.linkInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLink();
                  }
                }}
              />
            </div>
            <Button type="button" variant="outline" onClick={addLink}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
          {links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg border border-[#B87333]/30 bg-slate-800/50 px-3 py-2 max-w-full"
                >
                  <span className="text-sm text-white truncate max-w-[300px]">{link}</span>
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="rounded p-0.5 text-slate-400 hover:text-danger-400 transition-colors flex-shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {links.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-2">
              No links added. Enter a URL and click "Add".
            </p>
          )}
        </CardContent>
      </Card>

      {/* Submit To */}
      <Card>
        <CardHeader
          title="Submit To"
          description="Add recipients for this proposal (optional)"
          action={
            <Button type="button" variant="outline" size="sm" onClick={addRecipient}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          }
        />
        <CardContent className="space-y-4">
          {recipients.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              No recipients added. Click "Add" to add a recipient.
            </p>
          ) : (
            recipients.map((recipient, index) => (
              <div
                key={recipient.id}
                className="flex gap-4 rounded-lg border border-[#B87333]/30 bg-slate-800/30 p-4"
              >
                <div className="flex-1 grid gap-4 md:grid-cols-2">
                  <Select
                    label="Salutation"
                    value={recipient.salutation}
                    onChange={(e) =>
                      updateRecipient(recipient.id, 'salutation', e.target.value)
                    }
                    options={[
                      { value: 'Mr.', label: 'Mr.' },
                      { value: 'Ms.', label: 'Ms.' },
                      { value: 'Mrs.', label: 'Mrs.' },
                      { value: 'Dr.', label: 'Dr.' },
                    ]}
                    error={errors[`submitted_to.${index}.salutation`]}
                    placeholder="Select salutation"
                    required
                  />
                  <Input
                    label="Name"
                    value={recipient.name}
                    onChange={(e) =>
                      updateRecipient(recipient.id, 'name', e.target.value)
                    }
                    error={errors[`submitted_to.${index}.name`]}
                    placeholder="e.g., John Smith"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRecipient(recipient.id)}
                  className="self-center rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-danger-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting}
        >
          Create Proposal
        </Button>
      </div>
    </form>
  );
}
