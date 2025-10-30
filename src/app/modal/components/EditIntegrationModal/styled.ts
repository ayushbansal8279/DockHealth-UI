import styled from 'styled-components';
import { Typography } from '@mui/material';
import { fontSizes } from '../../../styles/font';
import palette, { typography } from '../../../styles/palette';
import spacing from '@/app/styles/spacing';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';

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
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FilterSection = styled.div`
  padding: 12px;
  background-color: ${palette.coolGrey4};
  border-radius: 8px;
  border: 1px solid ${palette.coolGrey3};
  width: 100%;
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

export const CloseIconButton = styled(IconButton)`
  &&& {
    &.MuiButtonBase-root {
      position: absolute;
      top: ${spacing.small};
      right: ${spacing.small};
      display: block;
      z-index: 1;
    }
  }
`;

export const CloseIcon = styled(Close)`
  &&& {
    &.MuiSvgIcon-root {
      width: ${spacing.regular};
      height: ${spacing.regular};
    }
  }
`;

export const FilterSectionTypography = styled(Typography)`
  margin-bottom: 8px;
  font-weight: 600;
`;

export const SectionTitle = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${palette.midnightBlue};
  font-size: ${fontSizes.smallPlus};
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const OptionalBadge = styled.span`
  font-size: ${fontSizes.small};
  color: ${palette.coolGrey1};
  font-weight: 400;
  margin-left: 8px;
`;

export const TextFieldStyles = {
  backgroundColor: palette.whiteSmoke,
  width: '100%',
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
};
