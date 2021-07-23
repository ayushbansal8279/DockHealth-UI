import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { map } from 'ramda';
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
  ViewContainer,
  Header,
  EmptyListPlaceholder,
  CustomFieldItem,
  CustomFieldCell,
  CustomFieldText,
  CustomFieldHeaderText,
} from './styled';

const CustomFieldsView = () => {
  const userProfile = useSelector(userProfileSelector);
  const history = useHistory();
  const dispatch = useDispatch();
  const [customFields, setCustomFields] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

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
        setCustomFields(data);
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

  return (
    <ViewContainer>
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
              {customFields.map(field => (
                <CustomFieldItem>
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
                      onClick={() => handleRemoveClick(field.identifier)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CustomFieldCell>
                </CustomFieldItem>
              ))}
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
