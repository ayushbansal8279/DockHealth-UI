import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import map from 'ramda/src/map';
import pluck from 'ramda/src/pluck';
import move from 'ramda/src/move';
import { Box, IconButton } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { showGlobalErrorAlert } from 'alert/actions';
import * as CustomFieldsApi from 'api/custom-fields-api';
import { FieldTypeLabel } from 'helpers/field-type-helpers';
import { CategoryLabel } from 'helpers/patient-details-helpers';
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
import {
  EmptyListPlaceholder,
  CustomFieldItem,
  CustomFieldCell,
  CustomFieldText,
  CustomFieldHeaderText,
  DragHandle,
  CenterBox,
} from './styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const PatientCustomFieldsView = () => {
  const dispatch = useDispatch();
  const [customFields, setCustomFields] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const fetchPatientCustomFields = () => {
    CustomFieldsApi.getAllPatientCustomFields()
      .then(data => {
        const customFieldsData = data?.filter(
          cf => cf.contextType === 'CUSTOM' || cf.contextType === 'PREDEFINED',
        );
        setCustomFields(customFieldsData);
        setIsFetching(false);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  };

  useEffect(() => {
    fetchPatientCustomFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = field => {
    dispatch(
      openModal('EditCustomField', {
        options: {
          type: 'PATIENT',
        },
        customField: field,
        onUpdated: updatedField => {
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
          'Are you sure you want to delete this custom patient field? This action cannot be undone.',
        confirm: () => {
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
      await CustomFieldsApi.sortPatientCustomFields(
        pluck('identifier', result),
      );
    } catch (error) {
      dispatch(showGlobalErrorAlert());
      setCustomFields(lastWorkingOrder);
    }
  };

  const handleAddFieldClick = () => {
    dispatch(
      openModal('EditCustomField', {
        options: {
          type: 'PATIENT',
        },
        onAdded: async customField => {
          const newFields = (sortedFields
            ? [...sortedFields, customField]
            : [customField]
          ).map((field, index) => {
            return { ...field, sortIndex: index };
          });
          try {
            await CustomFieldsApi.sortPatientCustomFields(
              pluck('identifier', newFields),
            );
          } catch {
            fetchPatientCustomFields();
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
              <CustomFieldItem>
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
                  <CustomFieldHeaderText>Show on Header</CustomFieldHeaderText>
                </CustomFieldCell>
                <CustomFieldCell>
                  <CustomFieldHeaderText>
                    Include in Search
                  </CustomFieldHeaderText>
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
                  {sortedFields
                    .filter(field => field.contextType !== 'PREDEFINED')
                    .map(field => (
                      <SortableItem
                        key={field.identifier}
                        itemId={field.identifier}
                      >
                        {({ dragHandleProps }) => (
                          <div>
                            <CustomFieldItem>
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
                              <CustomFieldCell>
                                <CustomFieldText>
                                  {CategoryLabel[field.fieldCategoryType]}
                                </CustomFieldText>
                              </CustomFieldCell>
                              <CustomFieldCell>
                                <CustomFieldText>
                                  {field.displayOptions &&
                                  field.displayOptions?.includes(
                                    'PATIENT_HEADER',
                                  )
                                    ? 'Yes'
                                    : ''}
                                </CustomFieldText>
                              </CustomFieldCell>
                              <CustomFieldCell>
                                <CustomFieldText>
                                  {field.displayOptions &&
                                  field.displayOptions?.includes(
                                    'PATIENT_SEARCH',
                                  )
                                    ? 'Yes'
                                    : ''}
                                </CustomFieldText>
                              </CustomFieldCell>
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

export default PatientCustomFieldsView;
