import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box, TextField, Autocomplete } from '@mui/material';
// @ts-ignore
import debounce from 'lodash.debounce';
import moment from 'moment';
import EscalationPolicyTextField from './EscalationPolicyTextField';
import { closeModal } from '@/app/modal/actions';
import {
  ModalWrapper,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalContent,
  BasicInfoSection,
  ActionButtonsContainer,
  FilterSection,
  ActionSection,
  ActionContainer,
  SelectWrapper,
  AddTaskButtonWrapper,
  AddTaskButtonLabel,
  DeletIcon,
  SelectWrapperOne,
  ModalHeaderBox,
  PatientTableHeaderBox,
  PatientTableRowBox,
  FilterSectionTypography,
  TriggerSectionTypography,
  ActionsHeaderBox,
  ActionsTypography,
  ActionHeaderBox,
  ActionTypography,
  ActionSpacerBox,
  TriggerFlexBox,
  TriggerValueBox,
  TriggerUnitBox,
  SingleAutocompleteStyles,
  TextFieldStyles,
  StatusAutocompleteSx,
  ScopeAutocompleteSx,
  TimestampFieldAutocompleteSx,
  TimeUnitAutocompleteSx,
  PatientTextFieldStyles,
  CompactTextFieldStyles,
  StatusTextFieldStyles,
} from './styled';
import {
  scopeOptions,
  actionTypeOptions,
  timestampFieldOptions,
  timeUnitOptions,
  delayOptions,
} from '@/app/views/EscalationPolicies/helper';
import {
  createEscalationPolicy,
  updateEscalationPolicy,
} from '@/app/api/escalation-policy-api';
import { getPatientsByCriteria } from '@/app/api/patients-api';
import { Add } from '@mui/icons-material';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { organizationSelector } from '@/app/selectors/organization-selectors';
import { getCustomerTypeLabel } from '@/app/helpers/customer-type-helper';
import { useSelector } from 'react-redux';

interface CreateEscalationPolicyProps {
  editingPolicy?: any;
  userOptions?: any[];
  groupOptions?: any[];
  listOptions?: any[];
  workflowOptions?: any[];
  statusOptions?: any[];
  onConfirm?: () => void;
}

const CreateEscalationPolicy: React.FC<CreateEscalationPolicyProps> = ({
  editingPolicy,
  userOptions = [],
  groupOptions = [],
  listOptions = [],
  workflowOptions = [],
  statusOptions = [],
  onConfirm,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Get customer type label for patient placeholder
  const currentUser = useSelector(userProfileSelector);
  const { emrIntegrationType } = useSelector(organizationSelector) || {};
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const patientPlaceholder =
    emrIntegrationType === 'FHIR'
      ? `Search ${customerTypeLabel} (MRN #)`
      : `Search ${customerTypeLabel} (first last or last, first)`;

  // Form state
  const [formData, setFormData] = useState({
    name: editingPolicy?.name || '',
    description: editingPolicy?.description || '',
    enabled:
      editingPolicy?.enabled !== undefined ? editingPolicy.enabled : true,
    scope: editingPolicy?.config?.scope || '',
    scopeFilter: editingPolicy?.config?.scopeFilter || {},
    trigger: editingPolicy?.config?.trigger || {
      timestampField: 'createdDate',
      overdueValue: 1,
      overdueUnit: 'days',
    },
    actions: editingPolicy?.config?.actions || [],
    createdDate: editingPolicy?.config?.createdDate || null,
    updatedDate: editingPolicy?.config?.updatedDate || null,
  });

  // Filter state
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedAssigneeGroups, setSelectedAssigneeGroups] = useState<
    string[]
  >([]);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [selectedPatientLabels, setSelectedPatientLabels] = useState<string[]>(
    [],
  );
  const [selectedTaskLabels, setSelectedTaskLabels] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);

  // Patient search state
  const [patientOptions, setPatientOptions] = useState<any[]>([]);

  useEffect(() => {
    if (editingPolicy?.config) {
      const filter = editingPolicy.config.scopeFilter;
      setSelectedAssignees(filter?.assignee?.in?.user || []);
      setSelectedAssigneeGroups(filter?.assignee?.in?.group || []);
      setSelectedPatients(filter?.patients?.in || []);
      setSelectedPatientLabels(filter?.patientLabels?.in || []);
      setSelectedTaskLabels(filter?.taskLabels?.in || []);
      setSelectedStatuses(filter?.status?.in || []);
      setSelectedLists(filter?.lists?.in || []);
      setSelectedWorkflows(filter?.workflows?.in || []);

      // Handle legacy trigger format conversion
      if (editingPolicy.trigger) {
        let trigger = editingPolicy.trigger;

        // Convert legacy overdueBy format to new format if needed
        if (trigger.overdueBy && !trigger.overdueValue) {
          const legacyValue = trigger.overdueBy;
          let value = 10;
          let unit = 'minutes';

          // Parse legacy format like '1D', '2H', '30M'
          const match = legacyValue.match(/^(\d+)([MHDW])$/);
          if (match) {
            value = parseInt(match[1]);
            const legacyUnit = match[2];
            switch (legacyUnit) {
              case 'M':
                unit = 'minutes';
                break;
              case 'H':
                unit = 'hours';
                break;
              case 'D':
                unit = 'days';
                break;
              case 'W':
                unit = 'weeks';
                break;
            }
          }

          trigger = {
            ...trigger,
            overdueValue: value,
            overdueUnit: unit,
          };

          // Remove legacy fields
          delete trigger.overdueBy;
          delete trigger.relativeTo;
        }

        setFormData((prev) => ({
          ...prev,
          trigger: trigger,
        }));
      }
    }
  }, [editingPolicy]);

  const buildScopeFilter = () => {
    const filter: any = {};

    if (selectedAssignees.length > 0 || selectedAssigneeGroups.length > 0) {
      filter.assignee = { in: {} };
      if (selectedAssignees.length > 0)
        filter.assignee.in.user = selectedAssignees;
      if (selectedAssigneeGroups.length > 0)
        filter.assignee.in.group = selectedAssigneeGroups;
    }

    if (selectedPatients.length > 0) filter.patients = { in: selectedPatients };
    if (selectedPatientLabels.length > 0)
      filter.patientLabels = { in: selectedPatientLabels };
    if (selectedTaskLabels.length > 0)
      filter.taskLabels = { in: selectedTaskLabels };
    if (selectedStatuses.length > 0) filter.status = { in: selectedStatuses };
    if (selectedLists.length > 0) filter.lists = { in: selectedLists };
    if (selectedWorkflows.length > 0)
      filter.workflows = { in: selectedWorkflows };

    return filter;
  };

  const isFormValid = () => {
    if (!formData.name || !formData.scope) {
      return false;
    }

    for (const action of formData.actions) {
      switch (action.type) {
        case 'AddAssignee':
          if (
            (!action.params.addAssigneeUsers ||
              action.params.addAssigneeUsers.length === 0) &&
            (!action.params.addAssigneeGroups ||
              action.params.addAssigneeGroups.length === 0)
          ) {
            return false;
          }
          break;
        case 'CreateTask':
          if (!action.params.title) {
            return false;
          }
          break;
        case 'SendEmail':
          if (
            !action.params.recipients ||
            action.params.recipients.length === 0 ||
            !action.params.subject ||
            !action.params.body
          ) {
            return false;
          }
          break;
        case 'SendSlack':
          if (!action.params.channel || !action.params.message) {
            return false;
          }
          break;
        case 'ScheduleEscalation':
          if (!action.params.delay || !action.params.nextLevel) {
            return false;
          }
          break;
      }
    }

    return true;
  };

  const handleSave = async () => {
    setShowValidation(true);

    if (!isFormValid()) {
      return;
    }

    try {
      setLoading(true);

      const currentTimestamp = moment.utc().toISOString();

      const policyData = {
        name: formData.name,
        description: formData.description,
        enabled: formData.enabled,
        scope: formData.scope,
        scopeFilter: buildScopeFilter(),
        trigger: formData.trigger,
        actions: formData.actions,
        createdDate: editingPolicy?.config?.createdDate || currentTimestamp,
        updatedDate: currentTimestamp,
      };

      if (editingPolicy) {
        await updateEscalationPolicy(editingPolicy.identifier!, policyData);
      } else {
        await createEscalationPolicy(policyData);
      }

      onConfirm?.();
      dispatch(closeModal());
    } catch (err) {
      console.error('Failed to save escalation policy:', err);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const addAction = () => {
    setFormData({
      ...formData,
      actions: [...formData.actions, { type: 'AddAssignee', params: {} }],
    });
  };

  const removeAction = (index: number) => {
    const newActions = formData.actions.filter(
      (_: any, i: number) => i !== index,
    );
    setFormData({ ...formData, actions: newActions });
  };

  const updateAction = (index: number, actionData: any) => {
    const newActions = [...formData.actions];
    newActions[index] = actionData;
    setFormData({ ...formData, actions: newActions });
  };

  const fetchPatientsWithDebounce = useRef(
    debounce((searchTerm: string) => {
      if (searchTerm && searchTerm.length > 0) {
        getPatientsByCriteria(searchTerm).then((fetchedPatients) => {
          const formattedPatients = (fetchedPatients || []).map(
            (patient: any) => {
              const { patientIdentifier, patientName, dob, mrn } = patient;
              return {
                id: patientIdentifier,
                name: patientName || '',
                displayValue: patientName || '',
                dob: dob || '',
                mrn: mrn || '',
              };
            },
          );
          setPatientOptions(formattedPatients);
        });
      } else {
        setPatientOptions([]);
      }
    }, 300),
  ).current;

  const renderPatientSelect = (
    label: string,
    value: string[],
    onChange: (value: string[]) => void,
    options: any[],
  ) => {
    const selectedOptions = options.filter((opt) => value.includes(opt.id));

    return (
      <div style={{ width: '100%' }}>
        <Autocomplete
          multiple
          options={options}
          value={selectedOptions}
          onChange={(event, newValue) => {
            const newIds = newValue.map((option) => option.id);
            onChange(newIds);
          }}
          getOptionLabel={(option) =>
            option?.displayValue || option?.name || ''
          }
          disableCloseOnSelect
          renderOption={(props, option, state) => (
            <>
              {options && options[0]?.id === option?.id && (
                <PatientTableHeaderBox>
                  <div>Patient Name</div>
                  <div>DOB</div>
                  <div>MRN</div>
                </PatientTableHeaderBox>
              )}
              <li {...props}>
                <PatientTableRowBox>
                  <div>{option?.displayValue || option?.name}</div>
                  <div>{option?.dob || '-'}</div>
                  <div>{option?.mrn || '-'}</div>
                </PatientTableRowBox>
              </li>
            </>
          )}
          onInputChange={(event, newInputValue, reason) => {
            if (reason === 'input') {
              fetchPatientsWithDebounce(newInputValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant="outlined"
              size="small"
              placeholder={
                options.length === 0
                  ? patientPlaceholder
                  : `Select ${label.toLowerCase()}`
              }
              sx={PatientTextFieldStyles}
              fullWidth
            />
          )}
        />
      </div>
    );
  };

  const renderCompactSelect = (
    label: string,
    value: string[],
    onChange: (value: string[]) => void,
    options: any[],
    getLabel: (option: any) => string,
    getKey: (option: any) => string,
    onInputChange?: (searchTerm: string) => void,
    error?: boolean,
  ) => {
    const selectedOptions = options.filter((opt) =>
      value.includes(getKey(opt)),
    );

    return (
      <div style={{ width: '100%' }}>
        <Autocomplete
          multiple
          options={options}
          value={selectedOptions}
          onChange={(event, newValue) => {
            const newIds = newValue.map((option) => getKey(option));
            onChange(newIds);
          }}
          onInputChange={(event, newInputValue, reason) => {
            if (reason === 'input' && onInputChange) {
              onInputChange(newInputValue);
            }
          }}
          getOptionLabel={getLabel}
          disableCloseOnSelect
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant="outlined"
              size="small"
              placeholder={`Select ${label.toLowerCase()}`}
              error={error}
              sx={CompactTextFieldStyles}
              fullWidth
            />
          )}
        />
      </div>
    );
  };

  return (
    <ModalWrapper>
      <ModalContainer>
        <ModalHeader>
          <ModalHeaderBox>
            <ModalTitle>
              {editingPolicy
                ? 'Edit Escalation Policy'
                : 'Create New Escalation Policy'}
            </ModalTitle>
            {editingPolicy && (
              <Autocomplete
                options={[
                  { value: true, label: 'Active' },
                  { value: false, label: 'Inactive' },
                ]}
                value={
                  formData.enabled !== undefined
                    ? {
                        value: formData.enabled,
                        label: formData.enabled ? 'Active' : 'Inactive',
                      }
                    : undefined
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    enabled:
                      newValue?.value !== undefined ? newValue.value : true,
                  });
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Status"
                    variant="outlined"
                    size="small"
                    sx={StatusTextFieldStyles}
                  />
                )}
                sx={StatusAutocompleteSx}
                disableClearable
              />
            )}
          </ModalHeaderBox>
        </ModalHeader>

        <ModalContent>
          <BasicInfoSection>
            <SelectWrapperOne>
              <EscalationPolicyTextField
                label="Policy Name"
                fieldName="name"
                fieldType="form"
                formData={formData}
                setFormData={setFormData}
                width="80%"
                required
                error={showValidation && !formData.name}
              />
              <Autocomplete
                options={scopeOptions}
                value={
                  scopeOptions.find((opt) => opt.value === formData.scope) ||
                  null
                }
                onChange={(event, newValue) => {
                  setFormData({ ...formData, scope: newValue?.value || '' });
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Scope *"
                    variant="outlined"
                    size="small"
                    placeholder="Select scope..."
                    error={showValidation && !formData.scope}
                    sx={TextFieldStyles}
                  />
                )}
                sx={ScopeAutocompleteSx}
              />
            </SelectWrapperOne>

            <EscalationPolicyTextField
              label="Policy Details"
              fieldName="description"
              fieldType="form"
              formData={formData}
              setFormData={setFormData}
              multiline
              rows={1}
              placeholder="Describe what this escalation policy does..."
            />
          </BasicInfoSection>

          {formData.scope && (
            <FilterSection>
              <FilterSectionTypography variant="subtitle2">
                Filters
              </FilterSectionTypography>

              <SelectWrapper>
                {renderCompactSelect(
                  'Users',
                  selectedAssignees,
                  setSelectedAssignees,
                  userOptions,
                  (user) => user?.name || '',
                  (user) => user?.id || '',
                )}

                {renderCompactSelect(
                  'User Groups',
                  selectedAssigneeGroups,
                  setSelectedAssigneeGroups,
                  groupOptions,
                  (group) => group?.name || '',
                  (group) => group?.id || '',
                )}
              </SelectWrapper>

              <SelectWrapper>
                {renderPatientSelect(
                  'Patients',
                  selectedPatients,
                  setSelectedPatients,
                  patientOptions,
                )}

                {renderCompactSelect(
                  'Task Status',
                  selectedStatuses,
                  setSelectedStatuses,
                  statusOptions,
                  (status) => status?.name || '',
                  (status) => status?.id || '',
                )}
              </SelectWrapper>

              {(formData.scope === 'LIST' || formData.scope === 'WORKFLOW') && (
                <SelectWrapper>
                  {formData.scope === 'LIST' &&
                    renderCompactSelect(
                      'Lists',
                      selectedLists,
                      setSelectedLists,
                      listOptions,
                      (list) => list?.name || '',
                      (list) => list?.id || '',
                    )}
                  {formData.scope === 'WORKFLOW' &&
                    renderCompactSelect(
                      'Workflows',
                      selectedWorkflows,
                      setSelectedWorkflows,
                      workflowOptions,
                      (workflow) => workflow?.name || '',
                      (workflow) => workflow?.id || '',
                    )}
                </SelectWrapper>
              )}
            </FilterSection>
          )}

          {formData.scope && (
            <ActionSection>
              <TriggerSectionTypography variant="subtitle2">
                Trigger
              </TriggerSectionTypography>

              <SelectWrapper>
                <TriggerFlexBox>
                  <Autocomplete
                    options={timestampFieldOptions}
                    value={
                      timestampFieldOptions.find(
                        (opt: any) =>
                          opt.value === formData.trigger.timestampField,
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setFormData({
                        ...formData,
                        trigger: {
                          ...formData.trigger,
                          timestampField: newValue?.value || 'createdDate',
                        },
                      });
                    }}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Timestamp Field *"
                        variant="outlined"
                        size="small"
                        placeholder="Select timestamp field..."
                        sx={TextFieldStyles}
                      />
                    )}
                    sx={TimestampFieldAutocompleteSx}
                  />
                </TriggerFlexBox>

                <TriggerValueBox>
                  <EscalationPolicyTextField
                    label="Overdue After"
                    fieldName="overdueValue"
                    fieldType="trigger"
                    type="number"
                    formData={formData}
                    setFormData={setFormData}
                    inputProps={{ min: 1 }}
                    required
                  />
                </TriggerValueBox>

                <TriggerUnitBox>
                  <Autocomplete
                    options={timeUnitOptions}
                    value={
                      timeUnitOptions.find(
                        (opt: any) =>
                          opt.value === formData.trigger.overdueUnit,
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setFormData({
                        ...formData,
                        trigger: {
                          ...formData.trigger,
                          overdueUnit: newValue?.value || 'minutes',
                        },
                      });
                    }}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Time Unit *"
                        variant="outlined"
                        size="small"
                        placeholder="Select time unit..."
                        sx={TextFieldStyles}
                      />
                    )}
                    sx={TimeUnitAutocompleteSx}
                  />
                </TriggerUnitBox>
              </SelectWrapper>
            </ActionSection>
          )}

          {formData.scope && (
            <ActionSection>
              <ActionsHeaderBox>
                <ActionsTypography variant="subtitle2">
                  Actions
                </ActionsTypography>
                <Box mr={1}>
                  <AddTaskButtonWrapper onClick={addAction}>
                    <Add />
                    <AddTaskButtonLabel>Add Action</AddTaskButtonLabel>
                  </AddTaskButtonWrapper>
                </Box>
              </ActionsHeaderBox>

              {formData.actions.map((action: any, index: number) => (
                <ActionContainer key={index}>
                  <ActionHeaderBox>
                    <ActionTypography variant="caption">
                      {actionTypeOptions.find(
                        (opt: any) => opt.value === action.type,
                      )?.label || 'Action'}{' '}
                      {index + 1}
                    </ActionTypography>
                    <DeletIcon onClick={() => removeAction(index)} />
                  </ActionHeaderBox>

                  <Autocomplete
                    options={actionTypeOptions}
                    value={
                      actionTypeOptions.find(
                        (opt: any) => opt.value === action.type,
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      updateAction(index, {
                        type: newValue?.value || 'AddAssignee',
                        params: {}, // Reset params when action type changes
                      });
                    }}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Action Type *"
                        variant="outlined"
                        size="small"
                        placeholder="Select action type..."
                        sx={TextFieldStyles}
                      />
                    )}
                    sx={SingleAutocompleteStyles}
                  />

                  <ActionSpacerBox />

                  {action.type === 'AddAssignee' && (
                    <>
                      <SelectWrapper>
                        {renderCompactSelect(
                          'Add Users',
                          action.params.addAssigneeUsers || [],
                          (users: string[]) =>
                            updateAction(index, {
                              type: 'AddAssignee',
                              params: {
                                ...action.params,
                                addAssigneeUsers: users,
                              },
                            }),
                          userOptions,
                          (user: any) => user?.name || '',
                          (user: any) => user?.id || '',
                          undefined,
                          showValidation &&
                            (!action.params.addAssigneeUsers ||
                              action.params.addAssigneeUsers.length === 0) &&
                            (!action.params.addAssigneeGroups ||
                              action.params.addAssigneeGroups.length === 0),
                        )}

                        {renderCompactSelect(
                          'Add User Groups',
                          action.params.addAssigneeGroups || [],
                          (groups: string[]) =>
                            updateAction(index, {
                              type: 'AddAssignee',
                              params: {
                                ...action.params,
                                addAssigneeGroups: groups,
                              },
                            }),
                          groupOptions,
                          (group: any) => group?.name || '',
                          (group: any) => group?.id || '',
                          undefined,
                          showValidation &&
                            (!action.params.addAssigneeUsers ||
                              action.params.addAssigneeUsers.length === 0) &&
                            (!action.params.addAssigneeGroups ||
                              action.params.addAssigneeGroups.length === 0),
                        )}
                      </SelectWrapper>

                      <SelectWrapper>
                        <EscalationPolicyTextField
                          label="Comment (optional)"
                          fieldName="comment"
                          actionType="AddAssignee"
                          actionIndex={index}
                          actionParams={action.params}
                          updateAction={updateAction}
                          multiline
                          rows={1}
                        />
                      </SelectWrapper>
                    </>
                  )}

                  {action.type === 'SendEmail' && (
                    <>
                      <SelectWrapper>
                        <EscalationPolicyTextField
                          label="Recipients"
                          fieldName="recipients"
                          actionType="SendEmail"
                          actionIndex={index}
                          actionParams={action.params}
                          updateAction={updateAction}
                          placeholder="Enter email addresses separated by commas"
                          required
                          error={
                            showValidation &&
                            (!action.params.recipients ||
                              action.params.recipients.length === 0)
                          }
                        />

                        <EscalationPolicyTextField
                          label="Subject"
                          fieldName="subject"
                          actionType="SendEmail"
                          actionIndex={index}
                          actionParams={action.params}
                          updateAction={updateAction}
                          required
                          error={showValidation && !action.params.subject}
                        />
                      </SelectWrapper>

                      <SelectWrapper>
                        <EscalationPolicyTextField
                          label="Email Body"
                          fieldName="body"
                          actionType="SendEmail"
                          actionIndex={index}
                          actionParams={action.params}
                          updateAction={updateAction}
                          multiline
                          rows={1}
                          required
                          error={showValidation && !action.params.body}
                        />
                      </SelectWrapper>
                    </>
                  )}

                  {action.type === 'SendSlack' && (
                    <SelectWrapper>
                      <EscalationPolicyTextField
                        label="Channel"
                        fieldName="channel"
                        actionType="SendSlack"
                        actionIndex={index}
                        actionParams={action.params}
                        updateAction={updateAction}
                        placeholder="#channel-name"
                        required
                        error={showValidation && !action.params.channel}
                      />

                      <EscalationPolicyTextField
                        label="Message"
                        fieldName="message"
                        actionType="SendSlack"
                        actionIndex={index}
                        actionParams={action.params}
                        updateAction={updateAction}
                        multiline
                        rows={1}
                        required
                        error={showValidation && !action.params.message}
                      />
                    </SelectWrapper>
                  )}

                  {action.type === 'CreateTask' && (
                    <>
                      <SelectWrapper>
                        <EscalationPolicyTextField
                          label="Task Title"
                          fieldName="title"
                          actionType="CreateTask"
                          actionIndex={index}
                          actionParams={action.params}
                          updateAction={updateAction}
                          required
                          error={showValidation && !action.params.title}
                        />

                        <Autocomplete
                          options={[
                            { value: 'LOW', label: 'Low' },
                            { value: 'MEDIUM', label: 'Medium' },
                            { value: 'HIGH', label: 'High' },
                            { value: 'CRITICAL', label: 'Critical' },
                          ]}
                          value={
                            action.params.priority
                              ? {
                                  value: action.params.priority,
                                  label:
                                    action.params.priority
                                      .charAt(0)
                                      .toUpperCase() +
                                    action.params.priority
                                      .slice(1)
                                      .toLowerCase(),
                                }
                              : null
                          }
                          onChange={(event, newValue) =>
                            updateAction(index, {
                              type: 'CreateTask',
                              params: {
                                ...action.params,
                                priority: newValue?.value || '',
                              },
                            })
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Priority"
                              variant="outlined"
                              size="small"
                              placeholder="Select priority..."
                              sx={TextFieldStyles}
                            />
                          )}
                          sx={SingleAutocompleteStyles}
                        />
                      </SelectWrapper>

                      <SelectWrapper>
                        {renderCompactSelect(
                          'Assign To',
                          action.params.assignee || [],
                          (assignees: string[]) =>
                            updateAction(index, {
                              type: 'CreateTask',
                              params: { ...action.params, assignee: assignees },
                            }),
                          userOptions,
                          (user: any) => user?.name || '',
                          (user: any) => user?.id || '',
                        )}
                      </SelectWrapper>
                    </>
                  )}

                  {action.type === 'UpdateTask' && (
                    <>
                      <SelectWrapper>
                        <Autocomplete
                          options={statusOptions}
                          value={
                            statusOptions.find(
                              (opt: any) => opt.id === action.params.status,
                            ) || null
                          }
                          onChange={(event, newValue) =>
                            updateAction(index, {
                              type: 'UpdateTask',
                              params: {
                                ...action.params,
                                status: newValue?.id || '',
                              },
                            })
                          }
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Update Status"
                              variant="outlined"
                              size="small"
                              placeholder="Select status..."
                              sx={TextFieldStyles}
                            />
                          )}
                          sx={SingleAutocompleteStyles}
                        />

                        <Autocomplete
                          options={[
                            { value: 'LOW', label: 'Low' },
                            { value: 'MEDIUM', label: 'Medium' },
                            { value: 'HIGH', label: 'High' },
                            { value: 'CRITICAL', label: 'Critical' },
                          ]}
                          value={
                            action.params.priority
                              ? {
                                  value: action.params.priority,
                                  label:
                                    action.params.priority
                                      .charAt(0)
                                      .toUpperCase() +
                                    action.params.priority
                                      .slice(1)
                                      .toLowerCase(),
                                }
                              : null
                          }
                          onChange={(event, newValue) =>
                            updateAction(index, {
                              type: 'UpdateTask',
                              params: {
                                ...action.params,
                                priority: newValue?.value || '',
                              },
                            })
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Update Priority"
                              variant="outlined"
                              size="small"
                              placeholder="Select priority..."
                              sx={TextFieldStyles}
                            />
                          )}
                          sx={SingleAutocompleteStyles}
                        />
                      </SelectWrapper>

                      <SelectWrapper>
                        <EscalationPolicyTextField
                          label="Notes"
                          fieldName="notes"
                          actionType="UpdateTask"
                          actionIndex={index}
                          actionParams={action.params}
                          updateAction={updateAction}
                          multiline
                          rows={1}
                        />
                      </SelectWrapper>
                    </>
                  )}

                  {action.type === 'ScheduleEscalation' && (
                    <SelectWrapper>
                      <Autocomplete
                        options={delayOptions}
                        value={
                          delayOptions.find(
                            (opt: any) => opt.value === action.params.delay,
                          ) || null
                        }
                        onChange={(event, newValue) =>
                          updateAction(index, {
                            type: 'ScheduleEscalation',
                            params: {
                              ...action.params,
                              delay: newValue?.value || '',
                            },
                          })
                        }
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Delay *"
                            variant="outlined"
                            size="small"
                            placeholder="Select delay time..."
                            error={showValidation && !action.params.delay}
                            sx={TextFieldStyles}
                          />
                        )}
                        sx={SingleAutocompleteStyles}
                      />

                      <EscalationPolicyTextField
                        label="Next Level"
                        fieldName="nextLevel"
                        actionType="ScheduleEscalation"
                        actionIndex={index}
                        actionParams={action.params}
                        updateAction={updateAction}
                        required
                        error={showValidation && !action.params.nextLevel}
                      />
                    </SelectWrapper>
                  )}
                </ActionContainer>
              ))}
            </ActionSection>
          )}
        </ModalContent>

        <ActionButtonsContainer>
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          <ConfirmButton
            onClick={handleSave}
            disabled={loading || (showValidation && !isFormValid())}
          >
            {loading ? 'Saving...' : editingPolicy ? 'Update' : 'Create'}
          </ConfirmButton>
        </ActionButtonsContainer>
      </ModalContainer>
    </ModalWrapper>
  );
};

export default CreateEscalationPolicy;
