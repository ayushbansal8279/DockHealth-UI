import CustomField from '@/app/components/common/CustomField/CustomField';
import LabeledCollapse from '@/app/components/common/LabeledCollapse/LabeledCollapse';
import { GENDER_OPTIONS_BIRTH } from '@/app/types/gender';
import { Box } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { getGenderIdentityOptions } from '@/app/api/patients-api';

const ProfileGroup = ({ category, finalProfile, editMode }) => {
  const [collapse, setCollapse] = useState(false);
  const [genderIdentityOptions, setGenderIdentityOptions] = useState([]);

  const fetchGenderOptions = async () => {
    const genderIdentity = await getGenderIdentityOptions();
    
    const genders = genderIdentity?.map((item) => {
      return {
        identifier: item?.genderIdentityType,
        name: item?.description,
      };
    });
    setGenderIdentityOptions(genders);
  };

  const GENDER_OPTIONS = GENDER_OPTIONS_BIRTH?.map((item) => {
    return {
      identifier: item?.value,
      name: item?.label,
    };
  });

  useEffect(() => {
    fetchGenderOptions();
    if (category.name === 'Default Group') {
      setCollapse(true);
    }
  }, []);

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
        const record = finalProfile.find(
          (pd) => pd.customFieldIdentifier === field.fieldReferenceId,
        );


        if (field.name === 'Gender Identity') {
          field.options = genderIdentityOptions;
        }

        if (field.name === 'Gender') {
          field.options = GENDER_OPTIONS;
        }

        if (field.name === 'Dob') {
          const formattedDate = moment(record?.value, 'YYYY-MM-DD')
            .utc()
            .toISOString();

          record.value = formattedDate;
        }

        const render = () => {
          return (
            <CustomField
              readOnly={!editMode}
              field={field}
              initialValue={record?.value}
              // initialValue={
              //   record
              //     ? record?.values?.length > 1
              //       ? record.values
              //       : record.values?.[0] ||
              //         record.values?.[0]?.value ||
              //         record.values?.[0]?.customFieldOption
              //           ?.identifier
              //     : ''
              // }
              // fieldsGroupKey="profileMetaData"
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
