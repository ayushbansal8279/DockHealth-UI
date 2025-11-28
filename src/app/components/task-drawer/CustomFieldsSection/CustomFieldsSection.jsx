/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, useMediaQuery, Box } from '@mui/material';
import CustomField from 'components/common/CustomField/CustomField';
import { useBoolean } from 'hooks/useBoolean';
import { useForm, FormProvider } from 'react-hook-form';
import compose from 'ramda/src/compose';
import Spacing from 'components/common/Spacing';
import CategoryOptions from 'components/common/CategoryOptions/CategoryOptions';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import { partialUpdateTask } from 'actions/task-actions';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { TaskItemType } from 'helpers/task-helpers';
import {
  selectedTaskSelector,
  taskCustomFieldsSelector,
  taskDrawerFocusFieldSelector,
} from 'selectors/task-drawer-selectors';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import { organizationCustomFieldsSelector } from 'selectors/organization-selectors';
import { listCustomFieldsSelector } from 'selectors/list-details-selectors';
import { FieldType } from 'helpers/field-type-helpers';
import * as CustomFieldApi from 'api/custom-fields-api';
import { getAllProfileFieldTypes } from 'api/profile-type-field-api';
import { getAllProfileTypes } from 'api/profile-type-api';
import { formatMetaDataOutput } from './helpers';
import { enrichGroupsWithFields } from 'helpers/custom-fields-helpers';
import {
  CustomFieldsSectionContainer,
  CustomFieldsSectionContainerNoLine,
  HidableContainer,
  Title,
  styleFullRow,
} from './styled';

const CustomFieldsSection = ({ disabled, fieldCategoryType }) => {
  const dispatch = useDispatch();
  const selectedTask = useSelector(selectedTaskSelector);
  const selectedWorkflow = useSelector(workflowSelector);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const task = selectedTask || selectedWorkflow || {};
  const isWorkflow =
    task.itemType === TaskItemType.BUNDLE ||
    task.itemType === TaskItemType.TEMPLATE;
  const taskDrawerFocusField = useSelector(
    isWorkflow ? workflowAutofocusFieldSelector : taskDrawerFocusFieldSelector,
  );

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [itemGroups, setItemGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [groupCollapseStates, setGroupCollapseStates] = useState({});

  const organizationCustomFields = useSelector(
    organizationCustomFieldsSelector,
  );
  const listCustomFields = useSelector(listCustomFieldsSelector);
  const workflowCustomFields = organizationCustomFields
    ? organizationCustomFields.concat(listCustomFields)
    : listCustomFields;

  const { templates: taskCustomFields } = useSelector(taskCustomFieldsSelector);
  const unfilteredCustomFields = taskCustomFields?.length
    ? taskCustomFields
    : workflowCustomFields;

  const customFields = useMemo(() => {
    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const filtered = unfilteredCustomFields.filter((unfilteredCustomField) => {
      if (fieldCategoryType)
        return unfilteredCustomField?.fieldCategoryType === fieldCategoryType;
      return true;
    });

    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const filteredAndSorted = (
      filtered.filter((cf) => cf.taskListIdentifier === undefined) || []
    ).concat(
      filtered.filter((cf) => cf.taskListIdentifier !== undefined) || [],
    );

    return filteredAndSorted;
  }, [fieldCategoryType, unfilteredCustomFields]);

  const { 0: emptyVisible, 3: toggleEmptyVisible } = useBoolean(false);

  useEffect(() => {
    if (!task?.identifier) {
      return;
    }

    const fetchItemGroups = async () => {
      const context = isWorkflow ? 'WORKFLOW' : 'TASK';
      const profileTypeSearchTerm = isWorkflow ? 'workflow' : 'task';

      setIsLoadingGroups(true);
      try {
        const customGroups = await CustomFieldApi.searchCustomFiledGroups(
          context,
        );

        if (!customGroups || customGroups.length === 0) {
          setItemGroups([]);
          setIsLoadingGroups(false);
          return;
        }

        const predefinedTypes = await getAllProfileTypes('PREDEFINED');
        const profileType = predefinedTypes.find(
          (pt) =>
            pt.contextType === 'PREDEFINED' &&
            pt.name?.toLowerCase().includes(profileTypeSearchTerm),
        );

        if (!profileType) {
          console.warn(
            `No profile type found for ${context} with search term "${profileTypeSearchTerm}"`,
          );
          setItemGroups([]);
          setIsLoadingGroups(false);
          return;
        }

        const allProfileFieldTypes = await getAllProfileFieldTypes(
          profileType.identifier,
        );

        const enrichedGroups = enrichGroupsWithFields(
          customGroups,
          allProfileFieldTypes,
        );

        const groupsWithFields = enrichedGroups.filter(
          (group) => group.fields && group.fields.length > 0,
        );

        if (groupsWithFields.length === 0) {
          console.warn(
            `No groups with fields found for ${context} after enrichment`,
          );
          setItemGroups([]);
          setIsLoadingGroups(false);
          return;
        }

        groupsWithFields.sort((a, b) => {
          if (a.isDefault) return -1;
          if (b.isDefault) return 1;
          return (a.displayOrder || 0) - (b.displayOrder || 0);
        });

        setItemGroups(groupsWithFields);
        const initialCollapseStates = {};
        groupsWithFields.forEach((group) => {
          initialCollapseStates[group.identifier] = group.isDefault ?? true;
        });
        setGroupCollapseStates(initialCollapseStates);
      } catch (error) {
        console.error(`Error fetching ${context.toLowerCase()} groups:`, error);
        setItemGroups([]);
      } finally {
        setIsLoadingGroups(false);
      }
    };

    fetchItemGroups();
  }, [isWorkflow, task?.identifier]);

  const handleGroupToggle = useCallback(
    (groupName, event) => {
      const group = itemGroups.find((g) => g.name === groupName);
      if (group) {
        setGroupCollapseStates((prev) => ({
          ...prev,
          [group.identifier]: !prev[group.identifier],
        }));
      }
    },
    [itemGroups],
  );

  const updateCustomFields = useCallback(
    ({ taskMetaData }, fieldType) => {
      if (taskMetaData.length > 0) {
        isWorkflow
          ? dispatch(
              updatePartialWorkflow(task?.identifier, {
                taskMetaData: taskMetaData,
              }),
            )
          : dispatch(
              partialUpdateTask(task?.identifier, {
                taskMetaData: taskMetaData,
              }),
            );
      }
    },
    [dispatch, isWorkflow, task],
  );

  const formMethods = useForm();
  const { handleSubmit, setValue, getValues } = formMethods;

  const allFieldsForForm = useMemo(() => {
    if (itemGroups.length > 0) {
      const fieldsFromGroups = itemGroups.flatMap((group) => {
        if (!group.fields) return [];
        return group.fields;
      });
      return fieldsFromGroups;
    }
    return customFields;
  }, [itemGroups, customFields]);

  useEffect(() => {
    if (task?.taskMetaData && allFieldsForForm) {
      for (const customField of allFieldsForForm) {
        const isGroupField = itemGroups.length > 0;
        const fieldIdentifier = isGroupField
          ? customField.customFieldIdentifier || customField.identifier
          : customField.identifier || customField.customFieldIdentifier;
        if (!fieldIdentifier) continue;

        const cf = task?.taskMetaData?.find(
          (field) => field?.customFieldIdentifier === fieldIdentifier,
        );
        const fieldName = `taskMetaData.${fieldIdentifier}`;
        const hasValue = !!getValues('taskMetaData')?.[fieldIdentifier];
        if (customField.fieldType !== 'PICK_LIST' || !hasValue) {
          if (cf?.value) {
            setValue(fieldName, cf.value);
          } else if (cf?.values) {
            setValue(fieldName, cf.values);
          } else {
            setValue(fieldName, null);
          }
        }
      }
    }
  }, [getValues, setValue, task, allFieldsForForm, itemGroups.length]);

  const handleBlur = useCallback(
    (data, wasChanged = false, fieldType) => {
      if (wasChanged) {
        if (fieldType === FieldType.DATE) {
          const hasMissingParts = data.target?.value?.includes('_');
          if (hasMissingParts) return;
        }
        handleSubmit(
          compose(
            (formattedData) => updateCustomFields(formattedData, fieldType),
            (data) => formatMetaDataOutput(data),
          ),
        )(data);
      }
    },
    [handleSubmit, updateCustomFields],
  );

  const renderCustomField = useCallback(
    (field, index, alwaysVisible) => {
      const fieldIdentifier = field.identifier;
      const isFocused = taskDrawerFocusField === fieldIdentifier;
      const hasValue = !!getValues('taskMetaData')?.[fieldIdentifier];
      const isRequired =
        field.displayOptions?.includes('TASK_REQUIRED') || false;
      const visible =
        alwaysVisible || isFocused || emptyVisible || hasValue || isRequired;
      return (
        <HidableContainer key={field.identifier} visible={!visible}>
          <Grid item size={12} style={styleFullRow(isMobile, alwaysVisible)}>
            <CustomField
              readOnly={disabled}
              field={field}
              selected={getValues('taskMetaData')}
              onBlur={(data, wasChanged) =>
                handleBlur(data, wasChanged, field.fieldType)
              }
              fieldsGroupKey="taskMetaData"
              isFocused={isFocused}
              taskIdentifier={task.identifier}
              task={task}
            />
          </Grid>
        </HidableContainer>
      );
    },
    [
      taskDrawerFocusField,
      getValues,
      emptyVisible,
      isMobile,
      disabled,
      task,
      handleBlur,
    ],
  );

  const filteredGroups = useMemo(() => {
    return itemGroups;
  }, [itemGroups]);

  if (itemGroups.length > 0 && fieldCategoryType === 'TASK_CORE') {
    return null;
  }

  const renderGroupedFields = () => {
    if (isLoadingGroups) return null;

    if (filteredGroups.length === 0) {
      if (customFields.length === 0) return null;
      return fieldCategoryType === 'TASK_CORE' ? (
        <CustomFieldsSectionContainerNoLine>
          <Spacing vertical={1} />
          <CategoryOptions
            visibility={emptyVisible}
            onToggle={toggleEmptyVisible}
          />
          {customFields?.map((field, index) => {
            return renderCustomField(field, index, false);
          })}
        </CustomFieldsSectionContainerNoLine>
      ) : (
        <CustomFieldsSectionContainer>
          <Title>Custom fields</Title>
          <CategoryOptions
            visibility={emptyVisible}
            onToggle={toggleEmptyVisible}
          />
          {customFields?.map((field, index) => {
            return renderCustomField(field, index, false);
          })}
        </CustomFieldsSectionContainer>
      );
    }

    const Container =
      fieldCategoryType === 'TASK_CORE'
        ? CustomFieldsSectionContainerNoLine
        : CustomFieldsSectionContainer;

    return (
      <Container>
        {fieldCategoryType !== 'TASK_CORE' && <Title>Custom fields</Title>}
        {fieldCategoryType === 'TASK_CORE' && <Spacing vertical={1} />}
        {filteredGroups.map((group) => {
          const isGroupOpen = groupCollapseStates[group.identifier] ?? true;
          return (
            <LabeledCollapse
              key={group.identifier}
              name={group.name}
              isOpened={isGroupOpen}
              onClick={handleGroupToggle}
              noBorder={true}
              isSubMenu={true}
              capitalizeEachWord
            >
              {group.fields?.map((field, index) => {
                const fieldIdentifier =
                  field.customFieldIdentifier || field.identifier;
                return (
                  <Box
                    key={fieldIdentifier || index}
                    style={{ margin: '8px 4px' }}
                  >
                    <CustomField
                      readOnly={disabled}
                      field={(({
                        customFieldIdentifier,
                        identifier,
                        ...rest
                      }) => ({
                        ...rest,
                        identifier: customFieldIdentifier || identifier,
                      }))(field)}
                      selected={getValues('taskMetaData')}
                      onBlur={(data, wasChanged) =>
                        handleBlur(data, wasChanged, field.fieldType)
                      }
                      fieldsGroupKey="taskMetaData"
                      isFocused={
                        taskDrawerFocusField ===
                        (field.customFieldIdentifier || field.identifier)
                      }
                      taskIdentifier={task.identifier}
                      task={task}
                    />
                  </Box>
                );
              })}
            </LabeledCollapse>
          );
        })}
      </Container>
    );
  };

  return <FormProvider {...formMethods}>{renderGroupedFields()}</FormProvider>;
};

export default CustomFieldsSection;