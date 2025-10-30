/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import map from 'ramda/src/map';
import pluck from 'ramda/src/pluck';
import { Box, IconButton } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { showGlobalErrorAlert } from 'alert/actions';
import * as CustomFieldsApi from 'api/custom-fields-api';
import { DisplayOption, FieldType, FieldTypeLabel } from 'helpers/field-type-helpers';
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
import { getSortedFields, handleDragAndSort } from '@/app/helpers/custom-fields-helpers';

const UserCustomFieldsView = () => {
  const dispatch = useDispatch();
  const [customFields, setCustomFields] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const { columns, setColumnsToState } = useTaskListColumnsConfig();
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const fetchUserCustomFields = () => {
    CustomFieldsApi.getAllProviderCustomFields()
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
    fetchUserCustomFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = (field) => {
    dispatch(
      openModal('EditCustomField', {
        options: {
          type: 'PROVIDER',
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
          'Are you sure you want to delete this custom user / provider field? This action cannot be undone.',
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

  const sortedFields = useMemo(() => getSortedFields(customFields), [customFields]);

  const handleOnDragEnd = async (originID, destinationID) => {
    await handleDragAndSort({
      originID,
      destinationID,
      sortedFields,
      customFields,
      setCustomFields,
      dispatch,
      apiMethod: CustomFieldsApi.sortUserCustomFields,
      apiParams: (identifiers) => [identifiers]
    });
  };

  const handleAddFieldClick = () => {
    dispatch(
      openModal('EditCustomField', {
        options: {
          type: 'PROVIDER',
        },
        onAdded: async (customField) => {
          setColumnsToState([...columns, customField]);
          const newFields = (
            sortedFields ? [...sortedFields, customField] : [customField]
          ).map((field, index) => {
            return { ...field, sortIndex: index };
          });
          try {
            await CustomFieldsApi.sortUserCustomFields(
              pluck('identifier', newFields),
            );
          } catch {
            fetchUserCustomFields();
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
          <CenterBox>
            <AddButton onClick={handleAddFieldClick}>
              Add custom field
            </AddButton>
          </CenterBox>
          <Box p={1} />
          {customFields?.length > 0 ? (
            <>
              <CustomFieldItem editable type="PROVIDER">
                <CustomFieldCell>
                  <CustomFieldHeaderText>Field label</CustomFieldHeaderText>
                </CustomFieldCell>
                <CustomFieldCell>
                  <CustomFieldHeaderText>Field type</CustomFieldHeaderText>
                </CustomFieldCell>
                <CustomFieldCell>
                  <CustomFieldHeaderText>Readonly</CustomFieldHeaderText>
                </CustomFieldCell>
                <CustomFieldCell>
                  <CustomFieldHeaderText>Hidden</CustomFieldHeaderText>
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
                          <CustomFieldItem editable type="PROVIDER">
                            <DragHandle {...dragHandleProps}>
                              <DragHandleIcon />
                            </DragHandle>
                            <CustomFieldCell>
                              <CustomFieldText>{field.name}</CustomFieldText>
                            </CustomFieldCell>
                            <CustomFieldCell>
                              <CustomFieldText>
                                {field.fieldType === FieldType.RELATIONSHIP
                                  ? `${FieldTypeLabel[field.fieldType]} (${
                                      field.displayOptions?.includes(
                                        DisplayOption.SINGLE_SELECT,
                                      )
                                        ? 'Single'
                                        : 'Multiple'
                                    }) - ${field.relatedProfileType?.name}`
                                  : FieldTypeLabel[field.fieldType]}
                              </CustomFieldText>
                            </CustomFieldCell>
                            <CustomFieldCell>
                              <CustomFieldText>
                                {field.displayOptions &&
                                field.displayOptions?.includes('READONLY')
                                  ? 'Yes'
                                  : ''}
                              </CustomFieldText>
                            </CustomFieldCell>
                            <CustomFieldCell>
                              <CustomFieldText>
                                {field.displayOptions &&
                                field.displayOptions?.includes('HIDDEN')
                                  ? 'Yes'
                                  : ''}
                              </CustomFieldText>
                            </CustomFieldCell>
                            <CustomFieldCell>
                              <CustomFieldText>
                                {field.displayOptions &&
                                field.displayOptions?.includes(
                                  DisplayOption.TASK_REQUIRED,
                                )
                                  ? 'Yes'
                                  : ''}
                              </CustomFieldText>
                            </CustomFieldCell>
                            <>
                              <Box padding="0px 4px" justifySelf="flex-end">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditClick(field)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleRemoveClick(field.identifier)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </>
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
    </>
  );
};

export default UserCustomFieldsView;
