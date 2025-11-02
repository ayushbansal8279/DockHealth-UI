import styled from 'styled-components';
import { Typography, Button, Box } from '@mui/material';
import { fontSizes } from '../../../styles/font';
import palette, { typography } from '../../../styles/palette';
import spacing from '@/app/styles/spacing';
import { Delete } from '@mui/icons-material';

export const ModalWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  min-width: 900px;
  width: 100%;
  margin: 0 auto;
`;

export const ModalContainer = styled.div`
  background: ${palette.white};
  border-radius: 12px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
`;

export const ModalHeader = styled.div`
  padding: 24px 32px;
  background: ${palette.white};
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid ${palette.coolGrey3};
  flex-shrink: 0;
`;

export const ModalTitle = styled(Typography)`
  font-family: ${typography.text};
  font-size: ${fontSizes.large};
  font-weight: 600;
  color: ${palette.midnightBlue};
  margin: 0;
`;

export const ModalContent = styled.div`
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

export const BasicInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;


export const SelectWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;
export const SelectWrapperOne = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

export const FilterSection = styled.div`
  padding: 12px;
  background-color: ${palette.coolGrey4};
  border-radius: 8px;
  border: 1px solid ${palette.coolGrey3};
  width: 100%;
`;

export const ActionSection = styled.div`
  padding: 12px;
  border-radius: 8px;
  background-color: ${palette.coolGrey4};
  border: 1px solid ${palette.brightBlueWithAlpha};
`;

export const ActionContainer = styled.div`
  padding: 12px;
  background-color: transparent;
  border-radius: 6px;
  border: 1px solid ${palette.coolGrey3};
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;


export const ActionButtonsContainer = styled.div`
  padding: 20px 32px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  background: ${palette.white};
  border-radius: 0 0 12px 12px;
  border-top: 1px solid ${palette.coolGrey3};
  flex-shrink: 0;
`;

export const AddTaskButtonWrapper = styled(Button)`
  && {
    border-radius: 4px;
    background-color: ${palette.newDarkBlue};
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
  height: 32px;
  width: 120px;
`;

export const AddTaskButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      color: ${palette.white};
      display: inline-block;
      margin-left: ${spacing.tiny};
      text-transform: none;
      font-size: 14px;
      font-weight: 500;
      line-height: 11.19px;
      text-align: center;
      margin-right: 5px;
    }
  }
`;

export const DeletIcon = styled(Delete)`
  cursor: pointer;
  color: ${palette.coolGrey1};
  font-size: 20px;
`;

export const ModalHeaderBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const PatientTableHeaderBox = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 120px 120px;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
  font-weight: 600;
  font-size: 0.875rem;
`;

export const PatientTableRowBox = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 120px 120px;
  gap: 8px;
  width: 100%;
  font-size: 0.875rem;
`;

export const FilterSectionTypography = styled(Typography)`
  margin-bottom: 8px;
  font-weight: 600;
`;

export const TriggerSectionTypography = styled(Typography)`
  font-weight: 600;
  margin-bottom: 16px;
`;

export const ActionsHeaderBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const ActionsTypography = styled(Typography)`
  font-weight: 600;
`;

export const ActionHeaderBox = styled(Box)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 8px;
`;

export const ActionTypography = styled(Typography)`
  font-weight: 500;
  font-size: 15px;
`;

export const ActionSpacerBox = styled(Box)`
  margin-top: 16px;
`;

export const TriggerFlexBox = styled(Box)`
  flex: 2;
`;

export const TriggerValueBox = styled(Box)`
  flex: 1;
`;

export const TriggerUnitBox = styled(Box)`
  flex: 1;
`;

export const SingleAutocompleteStyles = {
  width: '100%',
  minWidth: 280,
};

export const TextFieldStyles = {
  backgroundColor: palette.whiteSmoke,
  '& .MuiOutlinedInput-root': {
    '& .MuiOutlinedInput-notchedOutline': {
      width: '100%',
    },
  },
  '& .MuiInputLabel-root': {
    textTransform: 'none',
    fontSize: '0.875rem',
    fontWeight: 400,
  },
  '& .MuiOutlinedInput-input': {
    textTransform: 'none',
  },
  '& .MuiOutlinedInput-input::placeholder': {
    textTransform: 'none',
    opacity: 0.6,
  },
  '& .MuiAutocomplete-tag': {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    fontSize: fontSizes.regular,
    '& .MuiChip-deleteIcon': {
      backgroundColor: palette.lightGrey,
      borderRadius: '50%',
      color: 'white',
    },
    '&:hover': {
      '& .MuiChip-deleteIcon': {
        color: '#daefff',
      },
      backgroundColor: '#daefff',
    },
  },
  '& .MuiAutocomplete-endAdornment .MuiAutocomplete-clearIndicator': {
    display: 'none',
  },
};

export const StatusAutocompleteSx = {
  width: '140px',
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    textTransform: 'none',
  },
};

export const ScopeAutocompleteSx = {
  ...SingleAutocompleteStyles,
  width: '20%',
};

export const TimestampFieldAutocompleteSx = {
  ...SingleAutocompleteStyles,
  width: '100%',
  minWidth: 0,
};

export const TimeUnitAutocompleteSx = {
  ...SingleAutocompleteStyles,
  width: '100%',
  minWidth: 0,
};

export const PatientTextFieldStyles = {
  ...TextFieldStyles,
  '& .MuiInputLabel-root': {
    textTransform: 'none',
    fontSize: '0.875rem',
    fontWeight: 400,
  },
};

export const CompactTextFieldStyles = {
  ...TextFieldStyles,
  '& .MuiInputLabel-root': {
    textTransform: 'none',
    fontSize: '0.875rem',
    fontWeight: 400,
  },
};

export const StatusTextFieldStyles = {
  width: '140px',
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    textTransform: 'none',
  },
};