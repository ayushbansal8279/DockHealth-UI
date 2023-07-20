/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import map from 'ramda/src/map';
import pluck from 'ramda/src/pluck';
import move from 'ramda/src/move';
import { Box, IconButton } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { showGlobalErrorAlert } from 'alert/actions';
import * as CustomFieldsApi from 'api/custom-fields-api';
import { FieldTypeLabel } from 'helpers/field-type-helpers';
import { CategoryLabel } from 'helpers/task-details-helpers';
import { openModal } from 'modal/actions';
import AddButton from 'components/common/AddButton/AddButton';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import DragHandleIcon from 'img/drag-handle';
import SortableItem from 'components/common/SortableItem/SortableItem';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import {
  EmptyListPlaceholder,
  CustomFieldItem,
  CustomFieldCell,
  CustomFieldText,
  CustomFieldHeaderText,
  DragHandle,
  CenterBox,
} from './styled';

const TaskCustomFieldsView = ({ taskListIdentifier, editable = false }) => {
  const dispatch = useDispatch();
  const [customFields, setCustomFields] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const { columns, setColumnsToState } = useTaskListColumnsConfig();
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const fetchTaskCustomFields = () => {
    CustomFieldsApi.getAllTaskListCustomFields(taskListIdentifier)
      .then((data) => {
        const customFieldsData = data?.filter(
          (cf) => cf.contextType === 'CUSTOM',
        );
        setCustomFields(customFieldsData);
        setIsFetching(false);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  };

  useEffect(() => {
    fetchTaskCustomFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = (field) => {
    dispatch(
      openModal('EditCustomField', {
        options: {
          type: 'TASK',
        },
        customField: field,
        onUpdated: (updatedField) => {
          setColumnsToState(
            columns.map((f) =>
              f.identifier === updatedField.identifier
                ? { ...f, ...updatedField }
                : f,
            ),
          );
          setCustomFields(
            map((f) =>
              updatedField.identifier === f.identifier
                ? { ...f, ...updatedField }
                : f,
            ),
          );
        },
      }),
    );
  };

  const handleRemoveClick = (id) => {
    dispatch(
      openModal('DeleteConfirmation', {
        title: 'Delete field',
        description:
          'Are you sure you want to delete this custom task field? This action cannot be undone.',
        confirm: () => {
          setColumnsToState(columns.filter((f) => f.identifier !== id));
          CustomFieldsApi.deleteCustomField(id)
            .then(() =>
              setCustomFields((previousValue) =>
                previousValue.filter(({ identifier }) => id !== identifier),
              ),
            )
            .catch(() => {
              dispatch(showGlobalErrorAlert());
            });
        },
      }),
    );
  };

  const moveElementByIDs = (originID, destinationID, fields) => {
    if (!originID || !destinationID) return fields;
    const idents = pluck('identifier', fields);
    const indexFrom = idents.indexOf(originID);
    const indexTo = idents.indexOf(destinationID);
    return move(indexFrom, indexTo, fields).map((field, index) => ({
      ...field,
      sortIndex: index,
    }));
  };

  const sortedFields = useMemo(() => {
    return customFields?.slice().sort((a, b) => {
      return a?.sortIndex - b?.sortIndex;
    });
  }, [customFields]);

  const handleOnDragEnd = async (originID, destinationID) => {
    const result = moveElementByIDs(originID, destinationID, sortedFields);
    const lastWorkingOrder = [...customFields];
    setCustomFields(result);
    try {
      await CustomFieldsApi.sortTaskCustomFields(
        pluck('identifier', result),
        taskListIdentifier,
      );
    } catch {
      dispatch(showGlobalErrorAlert());
      setCustomFields(lastWorkingOrder);
    }
  };

  const handleAddFieldClick = () => {
    dispatch(
      openModal('EditCustomField', {
        options: {
          type: 'TASK',
        },
        taskListIdentifier,
        onAdded: async (customField) => {
          setColumnsToState([...columns, customField]);
          const newFields = (
            sortedFields ? [...sortedFields, customField] : [customField]
          ).map((field, index) => {
            return { ...field, sortIndex: index };
          });
          try {
            await CustomFieldsApi.sortTaskCustomFields(
              pluck('identifier', newFields),
              taskListIdentifier,
            );
          } catch {
            fetchTaskCustomFields();
          }
          setCustomFields(newFields);
        },
      }),
    );
  };

  return (
    <>
      {isFetching ? (
        Array.from({ length: 4 })
          .fill()
          .map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={index} pb="2px">
              <Skeleton variant="rect" width="100%" height={35} />
            </Box>
          ))
      ) : (
        <>
          {customFields?.length > 0 ? (
            <>
              <CustomFieldItem editable={editable} type="TASK">
                <CustomFieldCell>
                  <CustomFieldHeaderText>Field label</CustomFieldHeaderText>
                </CustomFieldCell>
                <CustomFieldCell>
                  <CustomFieldHeaderText>Field type</CustomFieldHeaderText>
                </CustomFieldCell>
                <CustomFieldCell>
                  <CustomFieldHeaderText>Field category</CustomFieldHeaderText>
                </CustomFieldCell>
                <CustomFieldCell>
                  <CustomFieldHeaderText>Required</CustomFieldHeaderText>
                </CustomFieldCell>
                <CustomFieldCell>
                  <Box width="68px" />
                </CustomFieldCell>
              </CustomFieldItem>
              <DndContext
                sensors={sensors}
                onDragEnd={({ active, over }) =>
                  handleOnDragEnd(active.id, over.id)
                }
              >
                <SortableContext items={pluck('identifier', sortedFields)}>
                  {sortedFields.map((field) => (
                    <SortableItem
                      key={field.identifier}
                      itemId={field.identifier}
                    >
                      {({ dragHandleProps }) => (
                        <div>
                          <CustomFieldItem editable={editable} type="TASK">
                            {editable && (
                              <DragHandle {...dragHandleProps}>
                                <DragHandleIcon />
                              </DragHandle>
                            )}
                            <CustomFieldCell>
                              <CustomFieldText>{field.name}</CustomFieldText>
                            </CustomFieldCell>
                            <CustomFieldCell>
                              <CustomFieldText>
                                {FieldTypeLabel[field.fieldType]}
                              </CustomFieldText>
                            </CustomFieldCell>
                            <CustomFieldCell>
                              <CustomFieldText>
                                {CategoryLabel[field.fieldCategoryType]}
                              </CustomFieldText>
                            </CustomFieldCell>
                            <CustomFieldCell>
                              <CustomFieldText>
                                {field.displayOptions &&
                                field.displayOptions?.includes('TASK_REQUIRED')
                                  ? 'Yes'
                                  : ''}
                              </CustomFieldText>
                            </CustomFieldCell>
                            {editable && (
                              <>
                                <CustomFieldCell>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditClick(field)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </CustomFieldCell>
                                <CustomFieldCell>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleRemoveClick(field.identifier)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </CustomFieldCell>
                              </>
                            )}
                          </CustomFieldItem>
                        </div>
                      )}
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
            </>
          ) : (
            <EmptyListPlaceholder>List is empty</EmptyListPlaceholder>
          )}
        </>
      )}
      <Box p={1} />
      <CenterBox>
        {editable && (
          <AddButton onClick={handleAddFieldClick}>Add custom field</AddButton>
        )}
      </CenterBox>
    </>
  );
};

export default TaskCustomFieldsView;
