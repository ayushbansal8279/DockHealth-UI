import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { map, pluck, move } from 'ramda';
import { useHistory } from 'react-router-dom';
import { Box, IconButton } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { showGlobalErrorAlert } from 'alert/actions';
import * as CustomFieldsApi from 'api/custom-fields-api';
import { FieldTypeLabel } from 'helpers/field-type-helpers';
import { CategoryLabel } from 'helpers/patient-details-helpers';
import { setHeader } from 'actions/template-actions';
import { openModal } from 'modal/actions';
import { userProfileSelector } from 'selectors/user-selectors';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
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
import {
  ViewContainer,
  Header,
  EmptyListPlaceholder,
  CustomFieldItem,
  CustomFieldCell,
  CustomFieldText,
  CustomFieldHeaderText,
  DragHandle,
} from './styled';
import CustomSortableField from './CustomSortableField';

// eslint-disable-next-line sonarjs/cognitive-complexity
const CustomFieldsView = () => {
  const userProfile = useSelector(userProfileSelector);
  const history = useHistory();
  const dispatch = useDispatch();
  const [customFields, setCustomFields] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [lastWorkingOrder, setLastWorkingOrder] = useState(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    if (
      !(
        userProfile?.orgUserRole === 'OWNER' ||
        userProfile?.orgUserRole === 'ADMIN'
      )
    ) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  useEffect(() => {
    dispatch(
      setHeader({
        layout: [
          {
            key: 'title',
            component: <GenericHeader>Custom Fields</GenericHeader>,
            alignItems: 'center',
          },
        ],
      }),
    );

    CustomFieldsApi.getAllPatientCustomFields()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddFieldClick = () => {
    dispatch(
      openModal('EditCustomPatientField', {
        onAdded: customField =>
          setCustomFields(previousValue =>
            previousValue ? [...previousValue, customField] : [customField],
          ),
      }),
    );
  };

  const handleEditClick = field => {
    dispatch(
      openModal('EditCustomPatientField', {
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
      openModal('DeleteField', {
        confirm: () => {
          CustomFieldsApi.deletePatientCustomField(id)
            .then(() => {
              setCustomFields(previousValue =>
                previousValue.filter(({ identifier }) => id !== identifier),
              );
            })
            .catch(() => {
              dispatch(showGlobalErrorAlert());
            });
        },
      }),
    );
  };

  const newBetterOrder = action => {
    const idents = pluck('identifier', customFields);
    const idxFrom = idents.indexOf(action.active.id);
    const idxTo = idents.indexOf(action.over.id);
    return move(idxFrom, idxTo, customFields);
  };

  // const newOrder = action => {
  //   const idents = pluck('identifier', customFields);
  //   const idxFrom = idents.indexOf(action.active.id);
  //   const idxTo = idents.indexOf(action.over.id);
  //   if (idxFrom === 0) {
  //     // when taken from beginning
  //     // [{from},{from+1, to},{to, end}]->[{from+1,to},{from},{to, end}]
  //     console.log('case1!');
  //     return customFields
  //       .slice(1, idxTo)
  //       .concat(customFields.slice(idxFrom, idxFrom))
  //       .concat(customFields.slice(idxTo));
  //   }
  //   // when taken from end
  //   // [{0, to},{to, from},{from}]->[{0, to}, {from}, {to, from}]
  //   if (idxFrom === customFields.length - 1) {
  //     console.log('case2!');
  //     return customFields
  //       .slice(0, idxTo)
  //       .concat(customFields.slice(idxFrom, idxFrom))
  //       .concat(customFields.slice(idxTo, idxFrom));
  //   }
  //   // when put after itself
  //   // [{0, from}, {from}, {from+1, to}, {to, end}]->[{0, from}, {from+1, to}, {from}, {to, end}]
  //   if (idxFrom < idxTo) {
  //     console.log('case3!');
  //     return customFields
  //       .slice(0, idxFrom)
  //       .concat(customFields.slice(idxFrom + 1, idxTo))
  //       .concat(customFields.slice(idxFrom, idxFrom))
  //       .concat(customFields.slice(idxTo));
  //   }
  //   // when put before itself
  //   // [{0, to}, {to, from}, {from}, {from+1, end}]->[{0, to}, {from}, {to, from}, {from+1, end}]
  //   console.log('case4!');
  //   return customFields
  //     .slice(0, idxTo)
  //     .concat(customFields.slice(idxFrom, idxFrom))
  //     .concat(customFields.slice(idxTo, idxFrom))
  //     .concat(customFields.slice(idxFrom));
  // };

  const updateSortIndexes = () => {
    customFields.map((field, index) => ({ ...field, sortIndex: index }));
  };

  const handleOnDragEnd = action => {
    console.log(pluck('name', customFields));
    // const result = newOrder(action);
    const result = newBetterOrder(action);
    setLastWorkingOrder(customFields);
    setCustomFields(result);
    updateSortIndexes();
    console.log(pluck('name', customFields));
    console.log(pluck('name', result));
    // console.log(`new order`, customFields);
    setIsFetching(true);
    try {
      CustomFieldsApi.sendSortedPatientCustomFields(customFields).then(() => {
        setLastWorkingOrder(customFields);
      });
    } catch (error) {
      console.log('ERROR SENDING:', error);
      setCustomFields(lastWorkingOrder);
    }
    setIsFetching(false);
  };

  const getSortedFields = useMemo(() => {
    console.log('sortingTHIS');
    if (isFetching) return customFields;
    return customFields?.slice().sort((a, b) => {
      return a?.sortIndex - b?.sortIndex;
    });
  }, [customFields, isFetching]);

  return (
    <ViewContainer>
      {console.log(customFields)}
      <Header>Patient Custom Fields</Header>
      <Box p={1} />
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
                  <Box width="68px" />
                </CustomFieldCell>
              </CustomFieldItem>
              <DndContext sensors={sensors} onDragEnd={handleOnDragEnd}>
                <SortableContext items={pluck('identifier', customFields)}>
                  {getSortedFields().map(field => (
                    <CustomSortableField
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
                    </CustomSortableField>
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
      <AddButton onClick={handleAddFieldClick}>Add custom field</AddButton>
    </ViewContainer>
  );
};

export default CustomFieldsView;
