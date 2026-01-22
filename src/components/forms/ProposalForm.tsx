'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { proposalsApi, templatesApi, subscriptionsApi, ApiRequestError, ExtractedFields } from '@/lib/api';
import { ExtractionStatus } from '@/types';
import { insertProposal } from '@/lib/api/supabaseProposals';
import { proposalCreateSchema } from '@/lib/validations';
import { generateId } from '@/lib/utils';
import { supabase } from '@/lib/api/supabaseClient';
import {
  generateAllSignedUrls,
  STORAGE_BUCKETS,
  deleteFileFromStorage,
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
  file?: File; // Optional - not present when loading from draft
  size: number;
  path?: string; // Storage path after upload (used for autofill and submit)
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
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSavedMessage, setDraftSavedMessage] = useState<string | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
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

  // Extraction state for autofill
  const [isExtracting, setIsExtracting] = useState(false);

  // Proposal state for background processing
  const searchParams = useSearchParams();
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus | 'idle'>('idle');
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Helper to mark form as dirty (user made changes)
  const markDirty = () => {
    if (!isFormDirty) setIsFormDirty(true);
  };

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
  // Draft & Extraction Handling
  // ============================================================================

  // Reset form to initial state (for fresh /proposals/new navigation)
  const resetForm = () => {
    console.log('[ProposalForm] Resetting form to initial state');
    setProposalId(null);
    setTitle('');
    setClientName('');
    setClientEmail('');
    setIndustry('');
    setSummary('');
    setGoals('');
    setScope('');
    setStartDate('');
    setEndDate('');
    setDateOfProposal(new Date().toISOString().split('T')[0]);
    setTotalBudget(0);
    setCurrency(Currency.USD);
    setBillingType(BillingType.FIXED);
    setRecipients([]);
    setDeliverables([]);
    setDeliverableInput('');
    setMilestones([]);
    setTeamMembers([]);
    setLinks([]);
    setLinkInput('');
    setPendingDocuments([]);
    setPendingAudio([]);
    setExtractionStatus('idle');
    setExtractionProgress(0);
    setShowProcessingModal(false);
    setDraftSavedMessage(null);
    setSubmitError(null);
    setErrors({});
    setIsFormDirty(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Handle URL changes - load draft or reset form
  useEffect(() => {
    const draftIdFromUrl = searchParams.get('draft_id');
    console.log('[ProposalForm] URL change - draft_id:', draftIdFromUrl, 'Current:', proposalId);

    if (!draftIdFromUrl && proposalId) {
      // Navigated to fresh /proposals/new (no draft_id) but form has data - reset
      resetForm();
    } else if (draftIdFromUrl && draftIdFromUrl !== proposalId) {
      // New or different draft_id in URL - load it
      console.log('[ProposalForm] Loading draft:', draftIdFromUrl);
      loadDraft(draftIdFromUrl);
    }
    // If draftIdFromUrl === proposalId, do nothing (already loaded)
  }, [searchParams]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Helper to extract filename from storage path
  const getFileNameFromPath = (path: string): string => {
    const parts = path.split('/');
    return parts[parts.length - 1] || path;
  };

  // Load an existing draft proposal
  const loadDraft = async (id: string) => {
    try {
      const response = await proposalsApi.getById(id);

      // Handle both wrapped (ApiResponse) and direct response formats
      const responseData = response.success && response.data ? response.data : response;
      const draft = responseData as any;

      if (draft && draft.id) {
        setProposalId(id);

        // Apply draft fields to form
        if (draft.title) setTitle(draft.title);
        if (draft.client_name) setClientName(draft.client_name);
        if (draft.client_email) setClientEmail(draft.client_email);
        if (draft.industry) setIndustry(draft.industry);
        if (draft.summary) setSummary(draft.summary);
        if (draft.goals) setGoals(draft.goals);
        if (draft.scope) setScope(draft.scope);
        if (draft.start_date) setStartDate(draft.start_date);
        if (draft.end_date) setEndDate(draft.end_date);
        if (draft.total_budget) setTotalBudget(draft.total_budget);
        if (draft.currency) setCurrency(draft.currency as any);
        if (draft.billing_type) setBillingType(draft.billing_type as any);

        // Load uploaded documents from draft
        const documentPaths = draft.document_storage_paths || draft.document_path || [];
        if (documentPaths.length > 0) {
          const loadedDocs: PendingFile[] = documentPaths.map((path: string) => ({
            id: generateId(),
            name: getFileNameFromPath(path),
            size: 0, // Size unknown for already uploaded files
            path: path,
          }));
          setPendingDocuments(loadedDocs);
        }

        // Load uploaded audio files from draft
        const audioPaths = draft.audio_storage_paths || draft.audio_path || [];
        if (audioPaths.length > 0) {
          const loadedAudio: PendingFile[] = audioPaths.map((path: string) => ({
            id: generateId(),
            name: getFileNameFromPath(path),
            size: 0, // Size unknown for already uploaded files
            path: path,
          }));
          setPendingAudio(loadedAudio);
        }

        // Check extraction status - first try from draft response, then from API
        let currentExtractionStatus = draft.extraction_status as ExtractionStatus | undefined;
        let currentExtractionProgress = draft.extraction_progress ?? 0;
        const hasUploadedFiles = documentPaths.length > 0 || audioPaths.length > 0;

        console.log('[LoadDraft] Extraction status from draft:', currentExtractionStatus, 'Progress:', currentExtractionProgress, 'Has files:', hasUploadedFiles);

        // Always fetch latest status from API if extraction might be in progress
        // This ensures we get the most up-to-date progress when returning to the page
        const shouldFetchLatestStatus =
          !currentExtractionStatus ||
          currentExtractionStatus === 'processing' ||
          currentExtractionStatus === 'pending';

        if (shouldFetchLatestStatus) {
          try {
            const statusResponse = await proposalsApi.getExtractionStatus(id);
            const statusData = statusResponse.success && statusResponse.data ? statusResponse.data : statusResponse;
            const status = statusData as { extraction_status: ExtractionStatus; extraction_progress: number };
            currentExtractionStatus = status.extraction_status;
            currentExtractionProgress = status.extraction_progress ?? 0;
            console.log('[LoadDraft] Extraction status from API:', currentExtractionStatus, 'Progress:', currentExtractionProgress);
          } catch (err) {
            console.error('[LoadDraft] Failed to get extraction status:', err);
          }
        }

        // Determine if extraction is in progress
        const isExtractionInProgress =
          currentExtractionStatus === 'processing' ||
          currentExtractionStatus === 'pending' ||
          // If there are files but no extraction status or not completed, assume processing
          (hasUploadedFiles && currentExtractionStatus !== 'completed' && currentExtractionStatus !== 'failed');

        console.log('[LoadDraft] Is extraction in progress:', isExtractionInProgress);

        if (isExtractionInProgress) {
          console.log('[LoadDraft] Showing processing modal and starting polling');
          setExtractionStatus('processing');
          setExtractionProgress(currentExtractionProgress || 0);
          setShowProcessingModal(true);
          startExtractionPolling(id);
        } else if (currentExtractionStatus) {
          setExtractionStatus(currentExtractionStatus);
          setExtractionProgress(currentExtractionProgress);
        }
      }
    } catch (error) {
      console.error('[LoadDraft] Failed to load draft:', error);
    }
  };

  // Create a draft proposal and queue extraction
  const createDraftProposal = async (
    audioPaths: string[],
    documentPaths: string[]
  ): Promise<string | null> => {
    console.log('[CreateDraft] Starting draft creation...', {
      productUser: !!productUser,
      templateId,
      audioPaths,
      documentPaths,
    });

    if (!productUser || !templateId) {
      console.log('[CreateDraft] Skipped - missing productUser or templateId');
      return null;
    }

    try {
      // Get subscription for the organization
      console.log('[CreateDraft] Getting subscription for org:', productUser.organization_id);
      const subscription = await subscriptionsApi.getActiveByOrganization(
        productUser.organization_id
      );
      console.log('[CreateDraft] Got subscription:', subscription.id);

      console.log('[CreateDraft] Calling createDraft API...');
      const response = await proposalsApi.createDraft({
        template_id: templateId,
        subscription_id: subscription.id,
        audio_storage_paths: audioPaths,
        document_storage_paths: documentPaths,
        title: title || undefined,
        client_name: clientName || undefined,
        client_email: clientEmail || undefined,
        industry: industry || undefined,
        summary: summary || undefined,
        goals: goals || undefined,
        scope: scope || undefined,
      });

      console.log('[CreateDraft] API response:', response);

      // Handle both wrapped (ApiResponse) and direct response formats
      const responseData = response.success && response.data ? response.data : response;
      const draftData = responseData as { success?: boolean; id?: string; extraction_job_id?: string | null };

      if (draftData.id) {
        const newDraftId = draftData.id;
        console.log('[CreateDraft] Draft created successfully:', newDraftId);
        setProposalId(newDraftId);
        setExtractionStatus('processing');
        setExtractionProgress(0);

        // Update URL so user can return
        const newUrl = `/proposals/new?template_id=${templateId}&draft_id=${newDraftId}`;
        window.history.replaceState({}, '', newUrl);

        // Show processing modal
        setShowProcessingModal(true);

        // Start polling for extraction status
        startExtractionPolling(newDraftId);

        return newDraftId;
      } else {
        console.log('[CreateDraft] API response not successful or missing id:', responseData);
      }
    } catch (error) {
      console.error('[CreateDraft] Failed to create draft:', error);
      // Show error to user
      setUploadError(
        error instanceof Error
          ? `Failed to create draft: ${error.message}`
          : 'Failed to create draft proposal'
      );
    }
    return null;
  };

  // Poll for extraction status
  const startExtractionPolling = (id: string) => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await proposalsApi.getExtractionStatus(id);

        // Handle both wrapped (ApiResponse) and direct response formats
        const responseData = response.success && response.data ? response.data : response;
        const status = responseData as { extraction_status: ExtractionStatus; extraction_progress: number };

        if (status.extraction_status) {
          setExtractionProgress(status.extraction_progress);
          setExtractionStatus(status.extraction_status);

          if (status.extraction_status === 'completed') {
            // Stop polling
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            // Load the full draft with extracted fields
            const draftResponse = await proposalsApi.getById(id);
            // Handle both response formats for draft too
            const draftData = draftResponse.success && draftResponse.data ? draftResponse.data : draftResponse;
            if (draftData) {
              applyDraftFields(draftData);
            }
          } else if (status.extraction_status === 'failed') {
            // Stop polling on failure
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            // Reload the draft to ensure files are still shown
            const draftResponse = await proposalsApi.getById(id);
            const draftData = draftResponse.success && draftResponse.data ? draftResponse.data : draftResponse;
            if (draftData) {
              applyDraftFields(draftData);
            }
          }
        }
      } catch (error) {
        console.error('[Polling] Failed to get extraction status:', error);
      }
    }, 2000); // Poll every 2 seconds
  };

  // Apply extracted fields from draft to form
  const applyDraftFields = (draft: any) => {
    // Apply all fields from draft (preserves user-entered values by using || checks)
    if (draft.title && !title) setTitle(draft.title);
    if (draft.client_name && !clientName) setClientName(draft.client_name);
    if (draft.client_email && !clientEmail) setClientEmail(draft.client_email);
    if (draft.industry && !industry) setIndustry(draft.industry);
    if (draft.start_date && !startDate) setStartDate(draft.start_date);
    if (draft.end_date && !endDate) setEndDate(draft.end_date);
    if (draft.total_budget && totalBudget === 0) setTotalBudget(draft.total_budget);
    if (draft.currency) setCurrency(draft.currency as any);
    if (draft.billing_type) setBillingType(draft.billing_type as any);

    // Merge text fields
    if (draft.summary) {
      setSummary((prev) => prev || draft.summary);
    }
    if (draft.goals) {
      setGoals((prev) => prev || draft.goals);
    }
    if (draft.scope) {
      setScope((prev) => prev || draft.scope);
    }

    // Merge arrays (deliverables, milestones, etc.)
    if (draft.deliverables && draft.deliverables.length > 0) {
      setDeliverables((prev) => {
        const newItems = draft.deliverables.filter((item: string) => !prev.includes(item));
        return [...prev, ...newItems];
      });
    }

    if (draft.milestones && Array.isArray(draft.milestones)) {
      setMilestones((prev) => {
        const existingTitles = prev.map((m) => m.title.toLowerCase());
        const newMilestones = draft.milestones
          .filter((m: any) => m.title && !existingTitles.includes(m.title.toLowerCase()))
          .map((m: any) => ({
            id: generateId(),
            title: m.title,
          }));
        return [...prev, ...newMilestones];
      });
    }

    if (draft.team_members && Array.isArray(draft.team_members)) {
      setTeamMembers((prev) => {
        const existingRoles = prev.map((t) => t.role.toLowerCase());
        const newMembers = draft.team_members
          .filter((t: any) => t.role && !existingRoles.includes(t.role.toLowerCase()))
          .map((t: any) => ({
            id: generateId(),
            role: t.role,
            experience: t.experience || '',
          }));
        return [...prev, ...newMembers];
      });
    }

    if (draft.links && Array.isArray(draft.links)) {
      setLinks((prev) => {
        const newLinks = draft.links.filter((link: string) => !prev.includes(link));
        return [...prev, ...newLinks];
      });
    }

    // Restore file paths if not already present
    const documentPaths = draft.document_storage_paths || [];
    if (documentPaths.length > 0 && pendingDocuments.length === 0) {
      const loadedDocs: PendingFile[] = documentPaths.map((path: string) => ({
        id: generateId(),
        name: getFileNameFromPath(path),
        size: 0,
        path: path,
      }));
      setPendingDocuments(loadedDocs);
    }

    const audioPaths = draft.audio_storage_paths || [];
    if (audioPaths.length > 0 && pendingAudio.length === 0) {
      const loadedAudio: PendingFile[] = audioPaths.map((path: string) => ({
        id: generateId(),
        name: getFileNameFromPath(path),
        size: 0,
        path: path,
      }));
      setPendingAudio(loadedAudio);
    }
  };

  // Check if form should be disabled during extraction
  const isFormDisabled = extractionStatus === 'processing';

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

  // Upload files immediately to Supabase and trigger extraction
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setIsAddingDocuments(true);

    try {
      const uploadedPaths: string[] = [];
      const newFiles: PendingFile[] = [];

      for (const file of Array.from(files)) {
        console.log(`[Upload] Starting document upload: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

        // Upload to Supabase immediately
        const { path, url, error } = await uploadFileToSupabase(
          file,
          STORAGE_BUCKETS.DOCUMENTS
        );

        if (error) {
          console.error(`[Upload] Document upload failed: ${file.name} - ${error}`);
          throw new Error(`Failed to upload ${file.name}: ${error}`);
        }

        console.log(`[Upload] Document uploaded successfully: ${file.name} -> ${path}`);
        uploadedPaths.push(path);
        newFiles.push({
          id: generateId(),
          name: file.name,
          file,
          size: file.size,
          path, // Store path for later use
        });
      }

      setPendingDocuments((prev) => [...prev, ...newFiles]);

      // Collect all file paths
      const allDocPaths = [...pendingDocuments.map((f) => f.path), ...uploadedPaths].filter(
        Boolean
      ) as string[];
      const allAudioPaths = pendingAudio.map((f) => f.path).filter(Boolean) as string[];

      console.log('[DocUpload] File paths collected:', { allDocPaths, allAudioPaths, proposalId, templateId });

      // If no draft yet, create one and queue extraction
      if (!proposalId && templateId) {
        console.log('[DocUpload] Creating new draft...');
        await createDraftProposal(allAudioPaths, allDocPaths);
      } else if (proposalId) {
        console.log('[DocUpload] Draft exists, updating draft and re-triggering extraction...');
        // Update draft with current file paths and re-trigger extraction
        try {
          // Update draft with file paths - backend should re-queue extraction
          await proposalsApi.updateDraft(proposalId, {
            document_storage_paths: allDocPaths,
            audio_storage_paths: allAudioPaths,
            extraction_status: 'processing',
            extraction_progress: 0,
          });
          console.log('[DocUpload] Draft updated with file paths:', { allDocPaths, allAudioPaths });

          // Show processing modal and start polling
          setExtractionStatus('processing');
          setExtractionProgress(0);
          setShowProcessingModal(true);
          startExtractionPolling(proposalId);
        } catch (updateError) {
          console.error('[DocUpload] Failed to update draft:', updateError);
          // Fallback to direct extraction
          setExtractionStatus('processing');
          setExtractionProgress(0);
          setShowProcessingModal(true);
          triggerFieldExtraction(allDocPaths, allAudioPaths);
        }
      } else {
        console.log('[DocUpload] No templateId, skipping draft creation');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(message);
      console.error('[DocUpload] Upload failed:', error);
    } finally {
      setIsAddingDocuments(false);
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }
    }
  };

  // Upload files immediately to Supabase and trigger extraction
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setIsAddingAudio(true);

    try {
      const uploadedPaths: string[] = [];
      const newFiles: PendingFile[] = [];

      for (const file of Array.from(files)) {
        console.log(`[Upload] Starting audio upload: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

        // Upload to Supabase immediately
        const { path, url, error } = await uploadFileToSupabase(
          file,
          STORAGE_BUCKETS.AUDIO
        );

        if (error) {
          console.error(`[Upload] Audio upload failed: ${file.name} - ${error}`);
          throw new Error(`Failed to upload ${file.name}: ${error}`);
        }

        console.log(`[Upload] Audio uploaded successfully: ${file.name} -> ${path}`);
        uploadedPaths.push(path);
        newFiles.push({
          id: generateId(),
          name: file.name,
          file,
          size: file.size,
          path, // Store path for later use
        });
      }

      setPendingAudio((prev) => [...prev, ...newFiles]);

      // Collect all file paths
      const allDocPaths = pendingDocuments.map((f) => f.path).filter(Boolean) as string[];
      const allAudioPaths = [...pendingAudio.map((f) => f.path), ...uploadedPaths].filter(
        Boolean
      ) as string[];

      console.log('[AudioUpload] File paths collected:', { allDocPaths, allAudioPaths, proposalId, templateId });

      // If no draft yet, create one and queue extraction
      if (!proposalId && templateId) {
        console.log('[AudioUpload] Creating new draft...');
        await createDraftProposal(allAudioPaths, allDocPaths);
      } else if (proposalId) {
        console.log('[AudioUpload] Draft exists, updating draft and re-triggering extraction...');
        // Update draft with current file paths and re-trigger extraction
        try {
          // Update draft with file paths - backend should re-queue extraction
          await proposalsApi.updateDraft(proposalId, {
            document_storage_paths: allDocPaths,
            audio_storage_paths: allAudioPaths,
            extraction_status: 'processing',
            extraction_progress: 0,
          });
          console.log('[AudioUpload] Draft updated with file paths:', { allDocPaths, allAudioPaths });

          // Show processing modal and start polling
          setExtractionStatus('processing');
          setExtractionProgress(0);
          setShowProcessingModal(true);
          startExtractionPolling(proposalId);
        } catch (updateError) {
          console.error('[AudioUpload] Failed to update draft:', updateError);
          // Fallback to direct extraction
          setExtractionStatus('processing');
          setExtractionProgress(0);
          setShowProcessingModal(true);
          triggerFieldExtraction(allDocPaths, allAudioPaths);
        }
      } else {
        console.log('[AudioUpload] No templateId, skipping draft creation');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(message);
      console.error('[AudioUpload] Upload failed:', error);
    } finally {
      setIsAddingAudio(false);
      if (audioInputRef.current) {
        audioInputRef.current.value = '';
      }
    }
  };

  const removeDocument = async (fileId: string) => {
    const file = pendingDocuments.find((f) => f.id === fileId);
    // Delete from storage if already uploaded
    if (file?.path) {
      console.log(`[Delete] Removing document from storage: ${file.name} -> ${file.path}`);
      await deleteFileFromStorage(STORAGE_BUCKETS.DOCUMENTS, file.path);
      console.log(`[Delete] Document removed successfully: ${file.name}`);

      // Update draft in DB to remove the file path
      if (proposalId) {
        const updatedDocPaths = pendingDocuments
          .filter((f) => f.id !== fileId && f.path)
          .map((f) => f.path) as string[];
        try {
          await proposalsApi.updateDraft(proposalId, {
            document_storage_paths: updatedDocPaths,
          });
          console.log(`[Delete] Draft updated - removed document path from DB`);
        } catch (err) {
          console.error(`[Delete] Failed to update draft in DB:`, err);
        }
      }
    } else if (file) {
      console.log(`[Delete] Removing local document (not uploaded): ${file.name}`);
    }
    setPendingDocuments((prev) => prev.filter((f) => f.id !== fileId));
  };

  const removeAudioFile = async (fileId: string) => {
    const file = pendingAudio.find((f) => f.id === fileId);
    // Delete from storage if already uploaded
    if (file?.path) {
      console.log(`[Delete] Removing audio from storage: ${file.name} -> ${file.path}`);
      await deleteFileFromStorage(STORAGE_BUCKETS.AUDIO, file.path);
      console.log(`[Delete] Audio removed successfully: ${file.name}`);

      // Update draft in DB to remove the file path
      if (proposalId) {
        const updatedAudioPaths = pendingAudio
          .filter((f) => f.id !== fileId && f.path)
          .map((f) => f.path) as string[];
        try {
          await proposalsApi.updateDraft(proposalId, {
            audio_storage_paths: updatedAudioPaths,
          });
          console.log(`[Delete] Draft updated - removed audio path from DB`);
        } catch (err) {
          console.error(`[Delete] Failed to update draft in DB:`, err);
        }
      }
    } else if (file) {
      console.log(`[Delete] Removing local audio (not uploaded): ${file.name}`);
    }
    setPendingAudio((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return 'Uploaded';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ============================================================================
  // Field Extraction for Autofill
  // ============================================================================

  const applyExtractedFields = (fields: ExtractedFields) => {
    // Single-value fields - only set if empty (preserves user input)
    if (fields.title && !title) setTitle(fields.title);
    if (fields.clientName && !clientName) setClientName(fields.clientName);
    if (fields.clientEmail && !clientEmail) setClientEmail(fields.clientEmail);
    if (fields.industry && !industry) setIndustry(fields.industry);
    if (fields.startDate && !startDate) setStartDate(fields.startDate);
    if (fields.endDate && !endDate) setEndDate(fields.endDate);
    if (fields.totalBudget !== undefined && totalBudget === 0) setTotalBudget(fields.totalBudget);
    if (fields.currency && currency === Currency.USD) setCurrency(fields.currency as Currency);
    if (fields.billingType && billingType === BillingType.FIXED) setBillingType(fields.billingType as BillingType);

    // Text fields that can be merged/appended from multiple sources
    if (fields.summary) {
      setSummary((prev) => {
        if (!prev) return fields.summary!;
        // Append if new content is different and not already included
        if (!prev.includes(fields.summary!)) {
          return `${prev}\n\n${fields.summary}`;
        }
        return prev;
      });
    }
    if (fields.goals) {
      setGoals((prev) => {
        if (!prev) return fields.goals!;
        if (!prev.includes(fields.goals!)) {
          return `${prev}\n\n${fields.goals}`;
        }
        return prev;
      });
    }
    if (fields.scope) {
      setScope((prev) => {
        if (!prev) return fields.scope!;
        if (!prev.includes(fields.scope!)) {
          return `${prev}\n\n${fields.scope}`;
        }
        return prev;
      });
    }

    // Arrays - merge new extracted data with existing (deduplicate)
    if (fields.deliverables && fields.deliverables.length > 0) {
      setDeliverables((prev) => {
        const newItems = fields.deliverables!.filter((item) => !prev.includes(item));
        return [...prev, ...newItems];
      });
    }

    if (fields.milestones && fields.milestones.length > 0) {
      setMilestones((prev) => {
        const existingTitles = prev.map((m) => m.title.toLowerCase());
        const newMilestones = fields.milestones!
          .filter((m) => !existingTitles.includes(m.title.toLowerCase()))
          .map((m) => ({
            id: generateId(),
            title: m.title,
          }));
        return [...prev, ...newMilestones];
      });
    }

    if (fields.teamMembers && fields.teamMembers.length > 0) {
      setTeamMembers((prev) => {
        const existingRoles = prev.map((t) => t.role.toLowerCase());
        const newMembers = fields.teamMembers!
          .filter((t) => !existingRoles.includes(t.role.toLowerCase()))
          .map((t) => ({
            id: generateId(),
            role: t.role,
            experience: t.experience,
          }));
        return [...prev, ...newMembers];
      });
    }

    if (fields.links && fields.links.length > 0) {
      setLinks((prev) => {
        const newLinks = fields.links!.filter((link) => !prev.includes(link));
        return [...prev, ...newLinks];
      });
    }

    if (fields.recipients && fields.recipients.length > 0) {
      setRecipients((prev) => {
        const existingNames = prev.map((r) => r.name.toLowerCase());
        const newRecipients = fields.recipients!
          .filter((r) => !existingNames.includes(r.name.toLowerCase()))
          .map((r) => ({
            id: generateId(),
            salutation: r.salutation,
            name: r.name,
          }));
        return [...prev, ...newRecipients];
      });
    }
  };

  const triggerFieldExtraction = async (
    documentPaths: string[],
    audioPaths: string[]
  ) => {
    if (documentPaths.length === 0 && audioPaths.length === 0) {
      // No files to extract, reset status
      setExtractionStatus('idle');
      setShowProcessingModal(false);
      return;
    }

    setIsExtracting(true);
    // Simulate progress for synchronous extraction
    setExtractionProgress(10);

    try {
      // Generate signed URLs for the uploaded files
      const { documentUrls, audioUrls, errors } = await generateAllSignedUrls(
        documentPaths,
        audioPaths
      );

      setExtractionProgress(30);

      if (documentUrls.length === 0 && audioUrls.length === 0) {
        console.warn('[Extraction] Failed to generate signed URLs for extraction');
        setExtractionStatus('failed');
        return;
      }

      // Call extraction API
      console.log('[Extraction] Calling extract-fields API with:', {
        document_urls: documentUrls,
        audio_urls: audioUrls,
      });

      setExtractionProgress(50);

      const response = await proposalsApi.extractFields({
        document_urls: documentUrls,
        audio_urls: audioUrls,
      });

      setExtractionProgress(80);

      console.log('[Extraction] API response:', response);

      // Handle both wrapped (response.data.fields) and direct (response.fields) response formats
      const extractedFields = (response as any).fields || response.data?.fields;

      if (response.success && extractedFields) {
        console.log('[Extraction] Applying extracted fields:', extractedFields);
        applyExtractedFields(extractedFields);
        setExtractionProgress(100);
        setExtractionStatus('completed');
      } else {
        console.warn('[Extraction] No fields found in response:', response);
        setExtractionStatus('completed'); // Still mark as completed, just no fields
      }
    } catch (error: any) {
      console.error('[Extraction] Field extraction failed:', error);
      console.error('[Extraction] Error details:', {
        message: error?.message,
        status: error?.status,
        code: error?.code,
        name: error?.name,
      });
      // Check for timeout/network errors
      if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Failed to fetch')) {
        console.warn('[Extraction] Request timed out or network error - extraction may still be processing on server');
      }
      setExtractionStatus('failed');
      // Non-blocking - user can still fill form manually
    } finally {
      setIsExtracting(false);
    }
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

  const handleSaveDraft = async () => {
    setDraftSavedMessage(null);
    setSubmitError(null);

    if (!productUser) {
      setSubmitError('You must be logged in to save a draft');
      return;
    }

    try {
      setIsSavingDraft(true);

      if (proposalId) {
        // Update existing draft
        await proposalsApi.updateDraft(proposalId, {
          title: title || undefined,
          client_name: clientName || undefined,
          client_email: clientEmail || undefined,
          industry: industry || undefined,
          summary: summary || undefined,
          goals: goals || undefined,
          scope: scope || undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          total_budget: totalBudget || undefined,
          currency: currency || undefined,
          billing_type: billingType || undefined,
          deliverables: deliverables.filter(d => d.trim() !== ''),
          milestones: milestones.filter(m => m.title.trim() !== '').map(({ id, ...m }) => m) as any,
          team_members: teamMembers.filter(t => t.role.trim() !== '').map(({ id, ...t }) => t) as any,
          links: links.filter(l => l.trim() !== ''),
          submitted_to: recipients
            .filter(r => r.name.trim() !== '')
            .map(r => r.salutation && r.name ? `${r.salutation} ${r.name}` : r.name || ''),
        });
        setDraftSavedMessage('Draft saved successfully');
      } else {
        // Create new draft
        const subscription = await subscriptionsApi.getActiveByOrganization(
          productUser.organization_id
        );

        if (!subscription) {
          setSubmitError('No active subscription found');
          return;
        }

        if (!templateId) {
          setSubmitError('No template selected');
          return;
        }

        const response = await proposalsApi.createDraft({
          template_id: templateId,
          subscription_id: subscription.id,
          title: title || undefined,
          client_name: clientName || undefined,
          client_email: clientEmail || undefined,
          industry: industry || undefined,
          summary: summary || undefined,
          goals: goals || undefined,
          scope: scope || undefined,
          audio_storage_paths: pendingAudio.map(f => f.path).filter(Boolean) as string[],
          document_storage_paths: pendingDocuments.map(f => f.path).filter(Boolean) as string[],
        });

        // Handle both wrapped (ApiResponse) and direct response formats
        const result = response.success && response.data ? response.data : response;
        const draftId = (result as any).id;

        if (draftId) {
          setProposalId(draftId);
          // Update URL with draft_id without full page reload
          const url = new URL(window.location.href);
          url.searchParams.set('draft_id', draftId);
          window.history.replaceState({}, '', url.toString());
          setDraftSavedMessage('Draft created successfully');
        }
      }

      // Clear dirty state and message after 3 seconds
      setIsFormDirty(false);
      setTimeout(() => setDraftSavedMessage(null), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Failed to save draft. Please try again.');
      }
    } finally {
      setIsSavingDraft(false);
    }
  };

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

      // Step 2: Get file paths (files already uploaded during autofill, skip re-upload)
      const uploadedDocs: UploadedFile[] = [];
      const uploadedAudioFiles: UploadedFile[] = [];

      // Process documents - only upload if not already uploaded
      for (const pendingFile of pendingDocuments) {
        if (pendingFile.path) {
          // Already uploaded during autofill
          uploadedDocs.push({
            id: pendingFile.id,
            name: pendingFile.name,
            path: pendingFile.path,
            url: '',
            size: pendingFile.size,
          });
        } else {
          // Upload now (edge case: file added after extraction)
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
      }

      // Process audio files - only upload if not already uploaded
      for (const pendingFile of pendingAudio) {
        if (pendingFile.path) {
          // Already uploaded during autofill
          uploadedAudioFiles.push({
            id: pendingFile.id,
            name: pendingFile.name,
            path: pendingFile.path,
            url: '',
            size: pendingFile.size,
          });
        } else {
          // Upload now (edge case: file added after extraction)
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
      }

      // Step 3: Generate signed URLs for all files
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

      // Step 5: Submit - either submit draft or create new proposal
      if (proposalId) {
        // Update draft with final form data and submit
        await proposalsApi.updateDraft(proposalId, {
          title,
          client_name: clientName,
          client_email: clientEmail,
          industry: industry || undefined,
          summary: summary || undefined,
          goals: goals || undefined,
          scope: scope || undefined,
          start_date: startDate,
          end_date: endDate,
          total_budget: totalBudget,
          currency,
          billing_type: billingType,
          deliverables,
          milestones: milestones.map(({ id, ...m }) => m) as any,
          team_members: teamMembers.map(({ id, ...t }) => t) as any,
          links,
          submitted_to: submittedTo,
        });

        // Submit the draft for generation
        await proposalsApi.submitDraft(proposalId);
      } else {
        // Create new proposal directly (legacy flow)
        await proposalsApi.generate({
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
          deliverables,
          milestones: milestones.map(({ id, ...m }) => m),
          team_members: teamMembers.map(({ id, ...t }) => t),
          links,
          document_storage_paths: signedDocUrls,
          audio_storage_paths: signedAudioUrls,
        });
      }

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
      markDirty();
      setDeliverables([...deliverables, deliverableInput.trim()]);
      setDeliverableInput('');
      // Clear deliverables error if any
      setErrors((prev) => ({ ...prev, deliverables: undefined }));
    }
  };

  const removeDeliverable = (index: number) => {
    markDirty();
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    markDirty();
    setMilestones([...milestones, getInitialMilestone()]);
  };

  const removeMilestone = (id: string) => {
    markDirty();
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const updateMilestone = (
    id: string,
    field: keyof MilestoneInput,
    value: string | number
  ) => {
    markDirty();
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const addTeamMember = () => {
    markDirty();
    setTeamMembers([...teamMembers, getInitialTeamMember()]);
  };

  const removeTeamMember = (id: string) => {
    markDirty();
    setTeamMembers(teamMembers.filter((t) => t.id !== id));
  };

  const updateTeamMember = (
    id: string,
    field: keyof TeamMemberInput,
    value: string | number | undefined
  ) => {
    markDirty();
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
        markDirty();
        setLinks([...links, linkInput.trim()]);
        setLinkInput('');
        setErrors((prev) => ({ ...prev, linkInput: undefined }));
      } catch {
        setErrors((prev) => ({ ...prev, linkInput: 'Invalid URL format' }));
      }
    }
  };

  const removeLink = (index: number) => {
    markDirty();
    setLinks(links.filter((_, i) => i !== index));
  };

  const addRecipient = () => {
    markDirty();
    setRecipients([...recipients, getInitialRecipient()]);
  };

  const removeRecipient = (id: string) => {
    markDirty();
    setRecipients(recipients.filter((r) => r.id !== id));
  };

  const updateRecipient = (
    id: string,
    field: keyof RecipientInput,
    value: string
  ) => {
    markDirty();
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

      {/* Loader Modal - for final submission */}
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

      {/* Processing Modal - for background extraction */}
      <Modal
        isOpen={showProcessingModal}
        onClose={() => setShowProcessingModal(false)}
        closeOnOverlayClick={false}
        closeOnEsc={true}
        showCloseButton={false}
        size="sm"
      >
        <div className="flex flex-col items-center justify-center py-8">
          {extractionStatus === 'processing' ? (
            <>
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#B87333] border-t-transparent mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Processing Your Files
              </h3>
              <p className="text-sm text-slate-400 text-center max-w-sm mb-4">
                We're extracting information from your uploaded files. This may take a few minutes for large audio files.
              </p>

              {/* Progress bar */}
              <div className="w-full max-w-xs mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Extracting fields...</span>
                  <span>{extractionProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-[#B87333] to-[#DA8A67] rounded-full transition-all duration-500"
                    style={{ width: `${extractionProgress}%` }}
                  />
                </div>
              </div>
            </>
          ) : extractionStatus === 'completed' ? (
            <>
              <div className="h-12 w-12 rounded-full bg-success-500/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Extraction Complete
              </h3>
              <p className="text-sm text-slate-400 text-center max-w-sm mb-4">
                Fields have been auto-filled. Please review and complete the remaining fields.
              </p>
            </>
          ) : extractionStatus === 'failed' ? (
            <>
              <div className="h-12 w-12 rounded-full bg-danger-500/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Extraction Failed
              </h3>
              <p className="text-sm text-slate-400 text-center max-w-sm mb-4">
                We couldn't extract fields from your files. You can still fill the form manually.
              </p>
            </>
          ) : null}

          {/* Action buttons */}
          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/proposals')}
            >
              View Proposals
            </Button>
            <Button
              type="button"
              onClick={() => setShowProcessingModal(false)}
            >
              {extractionStatus === 'processing' ? 'Wait Here' : 'Continue Editing'}
            </Button>
          </div>
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

      {/* Extraction Progress - shows when background extraction is in progress */}
      {(isExtracting || extractionStatus === 'processing') && (
        <div className="animate-fadeSlideIn border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Loader2 className="h-5 w-5 animate-spin text-[#DA8A67]" />
              <div className="absolute inset-0 animate-ping rounded-full bg-[#B87333]/20" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {extractionStatus === 'processing' ? 'Extracting fields from files...' : 'Auto-filling form fields...'}
              </p>
              <p className="text-xs text-slate-400">
                {extractionStatus === 'processing'
                  ? `Progress: ${extractionProgress}% - Form inputs are disabled until complete`
                  : 'Analyzing uploaded files'}
              </p>
            </div>
            {extractionStatus === 'processing' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowProcessingModal(true)}
              >
                View Details
              </Button>
            )}
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-[#B87333] to-[#DA8A67] rounded-full transition-all duration-500"
              style={{ width: extractionStatus === 'processing' ? `${extractionProgress}%` : '66%' }}
            />
          </div>
        </div>
      )}

      {/* Basic Information */}
      <Card className={isFormDisabled ? 'opacity-60 pointer-events-none' : ''}>
        <CardHeader title="Basic Information" description="Enter the proposal details" />
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Proposal Title"
                value={title}
                onChange={(e) => { markDirty(); setTitle(e.target.value); }}
                onBlur={() => validateField('title', title)}
                error={errors.title}
                placeholder="e.g., Website Redesign Project"
                required
                disabled={isFormDisabled}
              />
            </div>
            <Input
              label="Client Name"
              value={clientName}
              onChange={(e) => { markDirty(); setClientName(e.target.value); }}
              onBlur={() => validateField('client_name', clientName)}
              error={errors.client_name}
              placeholder="e.g., Acme Corporation"
              required
              disabled={isFormDisabled}
            />
            <Input
              label="Client Email"
              type="email"
              value={clientEmail}
              onChange={(e) => { markDirty(); setClientEmail(e.target.value); }}
              onBlur={() => validateField('client_email', clientEmail)}
              error={errors.client_email}
              placeholder="e.g., contact@acme.com"
              required
              disabled={isFormDisabled}
            />
            <Select
              label="Industry"
              value={industry}
              onChange={(e) => { markDirty(); setIndustry(e.target.value); }}
              options={INDUSTRY_OPTIONS.map((ind) => ({ value: ind, label: ind }))}
              placeholder="Select industry"
              disabled={isFormDisabled}
            />
            <DatePicker
              label="Proposal Date"
              value={dateOfProposal}
              onChange={(value) => setDateOfProposal(value)}
              error={errors.date_of_proposal}
              required
              disabled={isFormDisabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Project Description */}
      <Card className={isFormDisabled ? 'opacity-60 pointer-events-none' : ''}>
        <CardHeader
          title="Project Description"
          description="Describe the project in detail"
        />
        <CardContent className="space-y-6">
          <Textarea
            label="Summary"
            value={summary}
            onChange={(e) => { markDirty(); setSummary(e.target.value); }}
            error={errors.summary}
            placeholder="Brief overview of the project..."
            rows={3}
            required
          />
          <Textarea
            label="Goals"
            value={goals}
            onChange={(e) => { markDirty(); setGoals(e.target.value); }}
            error={errors.goals}
            placeholder="What are the key objectives of this project?"
            rows={4}
            required
          />
          <Textarea
            label="Scope"
            value={scope}
            onChange={(e) => { markDirty(); setScope(e.target.value); }}
            error={errors.scope}
            placeholder="Define what is included and excluded from this project..."
            rows={4}
            required
          />
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className={isFormDisabled ? 'opacity-60 pointer-events-none' : ''}>
        <CardHeader title="Timeline" description="Set the project schedule" />
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(value) => {
                markDirty();
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
                markDirty();
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
      <Card className={isFormDisabled ? 'opacity-60 pointer-events-none' : ''}>
        <CardHeader title="Budget & Billing" description="Set the project budget" />
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <Input
              label="Total Budget"
              type="number"
              value={totalBudget}
              onChange={(e) => { markDirty(); setTotalBudget(Number(e.target.value)); }}
              onBlur={() => validateField('total_budget', totalBudget)}
              error={errors.total_budget}
              min={0}
              step={0.01}
              required
            />
            <Select
              label="Currency"
              value={currency}
              onChange={(e) => { markDirty(); setCurrency(e.target.value as Currency); }}
              options={Object.entries(CURRENCY_CONFIG).map(([value, config]) => ({
                value,
                label: `${config.symbol} ${config.name}`,
              }))}
              required
            />
            <Select
              label="Billing Type"
              value={billingType}
              onChange={(e) => { markDirty(); setBillingType(e.target.value as BillingType); }}
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
      <Card className={isFormDisabled ? 'opacity-60 pointer-events-none' : ''}>
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
      <Card className={isFormDisabled ? 'opacity-60 pointer-events-none' : ''}>
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
      <Card className={isFormDisabled ? 'opacity-60 pointer-events-none' : ''}>
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
      <Card className={isFormDisabled ? 'opacity-60 pointer-events-none' : ''}>
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
      <Card className={isFormDisabled ? 'opacity-60 pointer-events-none' : ''}>
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

      {/* Form Actions */}
      <div className="flex items-center justify-between">
        {/* Left side - Save Draft (only shown when form has unsaved changes) */}
        <div className="flex items-center gap-3">
          {isFormDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              isLoading={isSavingDraft}
              disabled={isFormDisabled || isSubmitting || isSavingDraft}
            >
              {proposalId ? 'Save Draft' : 'Save as Draft'}
            </Button>
          )}
          {draftSavedMessage && (
            <span className="text-sm text-success-400 animate-fade-in">
              {draftSavedMessage}
            </span>
          )}
        </div>

        {/* Right side - Cancel and Submit */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isSubmitting || isSavingDraft}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isFormDisabled || isSubmitting || isSavingDraft}
          >
            {proposalId ? 'Generate Proposal' : 'Create Proposal'}
          </Button>
        </div>
      </div>
    </form>
  );
}
