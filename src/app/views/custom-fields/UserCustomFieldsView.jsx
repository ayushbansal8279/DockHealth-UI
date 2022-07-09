/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { map, pluck, move } from 'ramda';
import { Box, IconButton } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { showGlobalErrorAlert } from 'alert/actions';
import * as CustomFieldsApi from 'api/custom-fields-api';
import { FieldTypeLabel } from 'helpers/field-type-helpers';
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
import { useColumnsConfig } from 'context-api/columns-config-context';
import {
  EmptyListPlaceholder,
  CustomFieldItem,
  CustomFieldCell,
  CustomFieldText,
  CustomFieldHeaderText,
  DragHandle,
  CenterBox,
} from './styled';

const UserCustomFieldsView = () => {
  const dispatch = useDispatch();
  const [customFields, setCustomFields] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const { setCustomColumnsConfig, customColumnsConfig } = useColumnsConfig();
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const fetchUserCustomFields = () => {
    CustomFieldsApi.getAllProviderCustomFields()
      .then(data => {
        const customFieldsData = data?.filter(
          cf => cf.contextType === 'CUSTOM',
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

  const handleEditClick = field => {
    dispatch(
      openModal('EditCustomField', {
        options: {
          type: 'PROVIDER',
        },
        customField: field,
        onUpdated: updatedField => {
          setCustomColumnsConfig([
            ...customColumnsConfig.map(f =>
              f.identifier === updatedField.identifier
                ? { ...updatedField, isChecked: f.isChecked }
                : f,
            ),
          ]);
          setCustomFields(
            map(f =>
              updatedField.identifier === f.identifier
                ? { ...f, ...updatedField }
                : f,
            ),
          );
        },
      }),
    );
  };

  const handleRemoveClick = id => {
    dispatch(
      openModal('DeleteConfirmation', {
        title: 'Delete field',
        description:
          'Are you sure you want to delete this custom user / provider field? This action cannot be undone.',
        confirm: () => {
          setCustomColumnsConfig([
            ...customColumnsConfig.filter(f => f.identifier !== id),
          ]);
          CustomFieldsApi.deleteCustomField(id)
            .then(() =>
              setCustomFields(previousValue =>
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
    const idxFrom = idents.indexOf(originID);
    const idxTo = idents.indexOf(destinationID);
    return move(idxFrom, idxTo, fields).map((field, index) => ({
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
    const lastWorkingOrder = customFields.slice();
    setCustomFields(result);
    try {
      await CustomFieldsApi.sortUserCustomFields(pluck('identifier', result));
    } catch (error) {
      dispatch(showGlobalErrorAlert());
      setCustomFields(lastWorkingOrder);
    }
  };

  const handleAddFieldClick = () => {
    dispatch(
      openModal('EditCustomField', {
        options: {
          type: 'PROVIDER',
        },
        onAdded: async customField => {
          setCustomColumnsConfig([...customColumnsConfig, customField]);
          const newFields = (sortedFields
            ? [...sortedFields, customField]
            : [customField]
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
      {!isFetching ? (
        <>
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
                  {sortedFields.map(field => (
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
                                {FieldTypeLabel[field.fieldType]}
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
      ) : (
        new Array(4).fill().map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={index} pb="2px">
            <Skeleton variant="rect" width="100%" height={35} />
          </Box>
        ))
      )}
      <Box p={1} />
      <CenterBox>
        <AddButton onClick={handleAddFieldClick}>Add custom field</AddButton>
      </CenterBox>
    </>
  );
};

export default UserCustomFieldsView;
