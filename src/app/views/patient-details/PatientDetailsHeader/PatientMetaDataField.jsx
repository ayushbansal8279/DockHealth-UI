import { FieldType } from 'helpers/field-type-helpers';
import { PatientInfo } from './styled';
import { Box, Typography } from '@mui/material';
import DateLabel from '@/app/components/common/DateLabel/DateLabel';

const PatientMetaDataField = ({
    fieldType,
    customFieldName,
    value,
    displayNames,
    displayName
}) => {
    if (fieldType === FieldType.HYPERLINK) {
        return (
            <PatientInfo>
                <a href={value} target="_blank" rel="noreferrer">
                    {customFieldName}
                </a>
            </PatientInfo>
        );
    } else if (fieldType === FieldType.DATE) {
        return (
            <PatientInfo>
                <Typography>{customFieldName}: </Typography>
                <DateLabel date={value} />

            </PatientInfo>
        );
    } else {
        return (
            <PatientInfo>
                <Typography>{customFieldName}: </Typography>
                <Box ml={1} />
                {fieldType === FieldType.DROPDOWN_MULTI
                    ? `${displayNames?.join(',') || ''}`
                    : `${displayName || value}`}
            </PatientInfo>
        );
    }
};

export default PatientMetaDataField;