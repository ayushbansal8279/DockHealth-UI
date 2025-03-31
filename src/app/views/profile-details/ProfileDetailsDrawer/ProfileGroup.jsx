import React, { useState } from 'react';
import CustomField from '@/app/components/common/CustomField/CustomField';
import LabeledCollapse from '@/app/components/common/LabeledCollapse/LabeledCollapse';
import { GENDER_OPTIONS_BIRTH } from '@/app/types/gender';
import { Box } from '@mui/material';
import moment from 'moment';
import { FieldType } from '@/app/helpers/field-type-helpers';

const ProfileGroup = ({
  category,
  profileValues,
  editMode,
  context,
  genderIdentityOptions,
}) => {
  const [collapse, setCollapse] = useState(true);

  const GENDER_OPTIONS = GENDER_OPTIONS_BIRTH?.map((item) => {
    return {
      identifier: item?.value,
      name: item?.label,
    };
  });

  const handleCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <LabeledCollapse
      name={category.name}
      isOpened={collapse}
      onClick={handleCollapse}
      noBorder
    >
      {category?.fields?.map((field) => {
        const record =
          profileValues.find((pd) => {
            if (context === 'PATIENT')
              return pd.customFieldIdentifier === field.fieldReferenceId;
            if (context === 'PROFILETYPE')
              return field.fieldReferenceId === pd.profileTypeFieldIdentifier;
            return false;
          }) || {};

        if (context === 'PATIENT') {
          switch (field.name) {
            case 'Gender Identity':
              field.options = genderIdentityOptions;
              break;
            case 'Gender':
              field.options = GENDER_OPTIONS;
              break;
            case 'Dob':
              record.value = moment(record?.value, 'YYYY-MM-DD')
                .utc()
                .toISOString();
              break;
            default:
              break;
          }
        }

        const initialValue = () => {
          if (record) {
            if (context === 'PATIENT') {
              const value =
                field.fieldType === FieldType.DROPDOWN_MULTI ||
                field.fieldType === FieldType.RELATIONSHIP
                  ? record.values
                  : record.value;

              return value;
            }
            if (context === 'PROFILETYPE') {
              const value =
                record?.values?.length > 1
                  ? record.values
                  : record.values?.[0] ||
                    record.values?.[0]?.value ||
                    record.values?.[0]?.customFieldOption?.identifier;

              return value;
            }
          } else {
            return '';
          }
        };

        const render = () => {
          return (
            <CustomField
              readOnly={!editMode}
              field={field}
              initialValue={initialValue()}
              fieldsGroupKey="profileMetaData"
            />
          );
        };

        return (
          <Box key={field.identifier} style={{ margin: '8px 4px' }}>
            {render()}
          </Box>
        );
      })}
    </LabeledCollapse>
  );
};

export default ProfileGroup;
