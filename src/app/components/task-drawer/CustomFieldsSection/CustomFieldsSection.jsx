/* eslint-disable no-unused-expressions */
import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import { getTaskCustomFields } from 'actions/task-drawer-actions';
import CustomField from 'components/common/CustomField/CustomField';
import { useBoolean } from 'hooks/useBoolean';
import { useFormContext } from 'react-hook-form';
import { compose } from 'ramda';
import CategoryOptions from 'components/common/CategoryOptions/CategoryOptions';
import { partialUpdateTask } from 'actions/task-actions';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import {
  CustomFieldsSectionContainer,
  HideableContainer,
  Title,
  styleFullRow,
} from './styled';
import { formatMetaDataOutput } from './helpers';

const CustomFieldsSection = ({ task, taskCustomFields: { templates } }) => {
  const dispatch = useDispatch();
  const { 0: emptyVisible, 3: toggleEmptyVisible } = useBoolean(false);
  useEffect(() => {
    if (task) {
      const {
        identifier,
        taskList: { taskListIdentifier },
      } = task;
      dispatch(getTaskCustomFields(identifier, taskListIdentifier));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, task?.identifier]);

  const onBlur = useCallback(
    newTask => {
      dispatch(partialUpdateTask(task?.identifier, newTask));
      dispatch(showGlobalAlert(AlertMessages.UPDATED));
    },
    [dispatch, task],
  );

  const { handleSubmit, setValue, getValues } = useFormContext();

  useEffect(() => {
    if (task?.taskMetaData) {
      templates?.forEach(template => {
        const cf = task?.taskMetaData?.find(
          ({ customFieldIdentifier }) =>
            customFieldIdentifier === template.identifier,
        );
        const fieldName = `taskMetaData.${template.identifier}`;
        if (cf?.value) {
          setValue(fieldName, cf.value);
        } else {
          setValue(fieldName, null);
        }
      });
    }
  }, [setValue, task, templates]);

  const renderCustomField = useCallback(
    (field, i, showEmpty) => {
      return (
        <HideableContainer
          key={field.identifier}
          visibility={
            !showEmpty && !getValues()[`taskMetaData.${field.identifier}`]
          }
        >
          <Grid item xs={12} style={styleFullRow}>
            <CustomField
              readOnly={false}
              field={field}
              onBlur={handleSubmit(compose(onBlur, formatMetaDataOutput))}
              fieldsGroupKey="taskMetaData"
            />
          </Grid>
        </HideableContainer>
      );
    },
    [getValues, handleSubmit, onBlur],
  );
  if (templates.length === 0) return null;
  return (
    <CustomFieldsSectionContainer>
      <>
        <Title>Custom fields</Title>
        {templates?.map((field, index) => {
          return renderCustomField(field, index, emptyVisible);
        })}
        <CategoryOptions
          visibility={emptyVisible}
          onToggle={toggleEmptyVisible}
        />
      </>
    </CustomFieldsSectionContainer>
  );
};

export default CustomFieldsSection;
