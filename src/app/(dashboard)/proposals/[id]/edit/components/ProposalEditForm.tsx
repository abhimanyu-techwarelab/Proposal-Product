'use client';

import { useState } from 'react';
import { Plus, Save, X, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { DatePicker } from '@/components/ui/DatePicker';
import { Select } from '@/components/ui/Select';
import { generateId } from '@/lib/utils';
import { CURRENCY_CONFIG, BILLING_TYPE_CONFIG, INDUSTRY_OPTIONS } from '@/constants';

// Types for structured data
export interface MilestoneItem {
  id: string;
  title: string;
}

export interface TeamMemberItem {
  id: string;
  role: string;
  experience: string;
}

export interface RecipientItem {
  id: string;
  salutation: string;
  name: string;
}

export interface EditableFields {
  // Basic Info
  title: string;
  client_name: string;
  client_email: string;
  industry: string;

  // Content - Text Fields
  executive_summary: string;
  objectives: string;
  training_and_support: string;
  scope_of_work_introduction: string;
  scope_of_work_summary: string;
  scope_of_work: string;
  summary: string;
  goals: string;
  scope: string;

  // Dates
  start_date: string;
  end_date: string;
  date_of_proposal: string;
  duration_business_days: number;

  // Budget
  total_budget: number;
  currency: string;
  billing_type: string;

  // Simple string arrays (matching DB schema)
  deliverables: string[];
  links: string[];

  // Structured Array Fields
  milestones: MilestoneItem[];
  team_members: TeamMemberItem[];
  submitted_to: RecipientItem[];
}

interface ProposalEditFormProps {
  formData: EditableFields;
  onChange: (field: keyof EditableFields, value: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  hasChanges: boolean;
  saveError: string | null;
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  action?: React.ReactNode;
}

function CollapsibleSection({ title, children, defaultExpanded = false, action }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between border-b border-slate-700 pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
          <h4 className="text-sm font-medium text-slate-300">{title}</h4>
        </div>
        {isExpanded && action && (
          <div onClick={(e) => e.stopPropagation()}>
            {action}
          </div>
        )}
      </div>
      {isExpanded && children}
    </div>
  );
}

export function ProposalEditForm({
  formData,
  onChange,
  onSave,
  onCancel,
  isSaving,
  hasChanges,
  saveError,
}: ProposalEditFormProps) {
  // Input state for simple string arrays
  const [deliverableInput, setDeliverableInput] = useState('');
  const [linkInput, setLinkInput] = useState('');

  // Deliverables handlers (simple string array)
  const addDeliverable = () => {
    if (deliverableInput.trim()) {
      onChange('deliverables', [...formData.deliverables, deliverableInput.trim()]);
      setDeliverableInput('');
    }
  };

  const removeDeliverable = (index: number) => {
    onChange('deliverables', formData.deliverables.filter((_, i) => i !== index));
  };

  // Links handlers (simple string array)
  const addLink = () => {
    if (linkInput.trim()) {
      onChange('links', [...formData.links, linkInput.trim()]);
      setLinkInput('');
    }
  };

  const removeLink = (index: number) => {
    onChange('links', formData.links.filter((_, i) => i !== index));
  };

  // Milestones handlers
  const addMilestone = () => {
    const newItem: MilestoneItem = { id: generateId(), title: '' };
    onChange('milestones', [...formData.milestones, newItem]);
  };

  const updateMilestone = (id: string, value: string) => {
    onChange(
      'milestones',
      formData.milestones.map((m) => (m.id === id ? { ...m, title: value } : m))
    );
  };

  const removeMilestone = (id: string) => {
    onChange('milestones', formData.milestones.filter((m) => m.id !== id));
  };

  // Team Members handlers
  const addTeamMember = () => {
    const newItem: TeamMemberItem = { id: generateId(), role: '', experience: '' };
    onChange('team_members', [...formData.team_members, newItem]);
  };

  const updateTeamMember = (id: string, field: keyof TeamMemberItem, value: string) => {
    onChange(
      'team_members',
      formData.team_members.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const removeTeamMember = (id: string) => {
    onChange('team_members', formData.team_members.filter((t) => t.id !== id));
  };

  // Recipients handlers
  const addRecipient = () => {
    const newItem: RecipientItem = { id: generateId(), salutation: '', name: '' };
    onChange('submitted_to', [...formData.submitted_to, newItem]);
  };

  const updateRecipient = (id: string, field: keyof RecipientItem, value: string) => {
    onChange(
      'submitted_to',
      formData.submitted_to.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const removeRecipient = (id: string) => {
    onChange('submitted_to', formData.submitted_to.filter((r) => r.id !== id));
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Edit Content" description="Modify the proposal fields below" />

      <CardContent className="flex-1 overflow-y-auto space-y-4 pr-2">
        {/* Basic Info Section */}
        <CollapsibleSection title="Basic Information">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Enter proposal title..."
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Client Name"
              value={formData.client_name}
              onChange={(e) => onChange('client_name', e.target.value)}
              placeholder="Client name..."
            />
            <Input
              label="Client Email"
              type="email"
              value={formData.client_email}
              onChange={(e) => onChange('client_email', e.target.value)}
              placeholder="client@email.com"
            />
          </div>

          <Select
            label="Industry"
            value={formData.industry}
            onChange={(e) => onChange('industry', e.target.value)}
            options={INDUSTRY_OPTIONS.map((ind) => ({ value: ind, label: ind }))}
            placeholder="Select industry"
          />
        </CollapsibleSection>

        {/* Dates & Budget Section */}
        <CollapsibleSection title="Dates & Budget">
          <div className="grid grid-cols-3 gap-3">
            <DatePicker
              label="Proposal Date"
              value={formData.date_of_proposal}
              onChange={(value) => onChange('date_of_proposal', value)}
              placeholder="Select date"
            />
            <DatePicker
              label="Start Date"
              value={formData.start_date}
              onChange={(value) => onChange('start_date', value)}
              placeholder="Select date"
            />
            <DatePicker
              label="End Date"
              value={formData.end_date}
              onChange={(value) => onChange('end_date', value)}
              placeholder="Select date"
              minDate={formData.start_date}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Duration (Business Days)"
              type="number"
              value={formData.duration_business_days}
              onChange={(e) => onChange('duration_business_days', parseInt(e.target.value) || 0)}
              placeholder="Enter duration..."
            />
            <Input
              label="Total Budget"
              type="number"
              value={formData.total_budget}
              onChange={(e) => onChange('total_budget', parseFloat(e.target.value) || 0)}
              placeholder="Enter budget amount..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Currency"
              value={formData.currency}
              onChange={(e) => onChange('currency', e.target.value)}
              options={Object.entries(CURRENCY_CONFIG).map(([value, config]) => ({
                value,
                label: `${config.symbol} ${config.name}`,
              }))}
              placeholder="Select currency"
            />
            <Select
              label="Billing Type"
              value={formData.billing_type}
              onChange={(e) => onChange('billing_type', e.target.value)}
              options={Object.entries(BILLING_TYPE_CONFIG).map(([value, config]) => ({
                value,
                label: config.label,
              }))}
              placeholder="Select billing type"
            />
          </div>
        </CollapsibleSection>

        {/* Content Section */}
        <CollapsibleSection title="Content">
          <Textarea
            label="Executive Summary"
            value={formData.executive_summary}
            onChange={(e) => onChange('executive_summary', e.target.value)}
            placeholder="Enter executive summary..."
            className="min-h-[100px]"
          />

          <Textarea
            label="Objectives"
            value={formData.objectives}
            onChange={(e) => onChange('objectives', e.target.value)}
            placeholder="Enter objectives..."
            className="min-h-[100px]"
          />

          <Textarea
            label="Summary"
            value={formData.summary}
            onChange={(e) => onChange('summary', e.target.value)}
            placeholder="Enter proposal summary..."
            className="min-h-[100px]"
          />

          <Textarea
            label="Goals"
            value={formData.goals}
            onChange={(e) => onChange('goals', e.target.value)}
            placeholder="Enter project goals..."
            className="min-h-[100px]"
          />

          <Textarea
            label="Scope"
            value={formData.scope}
            onChange={(e) => onChange('scope', e.target.value)}
            placeholder="Enter project scope..."
            className="min-h-[100px]"
          />
        </CollapsibleSection>

        {/* Scope of Work Section */}
        <CollapsibleSection title="Scope of Work">
          <Textarea
            label="Scope of Work Introduction"
            value={formData.scope_of_work_introduction}
            onChange={(e) => onChange('scope_of_work_introduction', e.target.value)}
            placeholder="Enter scope of work introduction..."
            className="min-h-[80px]"
          />

          <Textarea
            label="Scope of Work"
            value={formData.scope_of_work}
            onChange={(e) => onChange('scope_of_work', e.target.value)}
            placeholder="Enter scope of work details..."
            className="min-h-[120px]"
          />

          <Textarea
            label="Scope of Work Summary"
            value={formData.scope_of_work_summary}
            onChange={(e) => onChange('scope_of_work_summary', e.target.value)}
            placeholder="Enter scope of work summary..."
            className="min-h-[80px]"
          />
        </CollapsibleSection>

        {/* Training & Support Section */}
        <CollapsibleSection title="Training & Support">
          <Textarea
            label="Training and Support"
            value={formData.training_and_support}
            onChange={(e) => onChange('training_and_support', e.target.value)}
            placeholder="Enter training and support details..."
            className="min-h-[100px]"
          />
        </CollapsibleSection>

        {/* Deliverables Section */}
        <CollapsibleSection title="Deliverables">
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

          {formData.deliverables.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.deliverables.map((deliverable, index) => (
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
          ) : (
            <p className="text-sm text-slate-400 text-center py-2">
              No deliverables added. Enter a deliverable and click "Add".
            </p>
          )}
        </CollapsibleSection>

        {/* Milestones Section */}
        <CollapsibleSection
          title="Milestones"
          action={
            <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
              <Plus className="mr-1 h-3 w-3" />
              Add
            </Button>
          }
        >
          {formData.milestones.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              No milestones. Click "Add" to add one.
            </p>
          ) : (
            formData.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex gap-2 rounded-lg border border-[#B87333]/30 bg-slate-800/30 p-3"
              >
                <div className="flex-1">
                  <Input
                    value={milestone.title}
                    onChange={(e) => updateMilestone(milestone.id, e.target.value)}
                    placeholder="Milestone title"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeMilestone(milestone.id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-danger-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </CollapsibleSection>

        {/* Team Members Section */}
        <CollapsibleSection
          title="Team Members"
          action={
            <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
              <Plus className="mr-1 h-3 w-3" />
              Add
            </Button>
          }
        >
          {formData.team_members.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              No team members. Click "Add" to add one.
            </p>
          ) : (
            formData.team_members.map((member) => (
              <div
                key={member.id}
                className="flex gap-2 rounded-lg border border-[#B87333]/30 bg-slate-800/30 p-3"
              >
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    label="Role"
                    value={member.role}
                    onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                    placeholder="e.g., Lead Developer"
                  />
                  <Input
                    label="Experience"
                    value={member.experience}
                    onChange={(e) => updateTeamMember(member.id, 'experience', e.target.value)}
                    placeholder="e.g., 5 years"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeTeamMember(member.id)}
                  className="self-end mb-1 rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-danger-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </CollapsibleSection>

        {/* Links Section */}
        <CollapsibleSection title="Reference Links">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="https://example.com"
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

          {formData.links.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.links.map((link, index) => (
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
          ) : (
            <p className="text-sm text-slate-400 text-center py-2">
              No links added. Enter a URL and click "Add".
            </p>
          )}
        </CollapsibleSection>

        {/* Submitted To Section */}
        <CollapsibleSection
          title="Submit To"
          action={
            <Button type="button" variant="outline" size="sm" onClick={addRecipient}>
              <Plus className="mr-1 h-3 w-3" />
              Add
            </Button>
          }
        >
          {formData.submitted_to.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              No recipients. Click "Add" to add one.
            </p>
          ) : (
            formData.submitted_to.map((recipient) => (
              <div
                key={recipient.id}
                className="flex gap-2 rounded-lg border border-[#B87333]/30 bg-slate-800/30 p-3"
              >
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Select
                    label="Salutation"
                    value={recipient.salutation}
                    onChange={(e) => updateRecipient(recipient.id, 'salutation', e.target.value)}
                    options={[
                      { value: 'Mr.', label: 'Mr.' },
                      { value: 'Ms.', label: 'Ms.' },
                      { value: 'Mrs.', label: 'Mrs.' },
                      { value: 'Dr.', label: 'Dr.' },
                    ]}
                    placeholder="Select"
                  />
                  <Input
                    label="Name"
                    value={recipient.name}
                    onChange={(e) => updateRecipient(recipient.id, 'name', e.target.value)}
                    placeholder="Recipient name"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRecipient(recipient.id)}
                  className="self-end mb-1 rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-danger-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </CollapsibleSection>

        {saveError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">{saveError}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-[#B87333]/30 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSave}
          disabled={!hasChanges || isSaving}
          isLoading={isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
