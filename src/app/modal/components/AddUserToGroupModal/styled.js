import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { Close } from '@mui/icons-material';
import { ModalWrapper } from '../styled';

export const AddPatientModalWrapper = styled(ModalWrapper)`
  display: flex;
  flex-direction: column;
  width: 870px;
  min-height: 600px;
  padding: ${spacing.regularPlus} ${spacing.largePlus};
  font-family: 'Montserrat', sans-serif;
  color: ${palette.mediumGrey};
`;

export const MainContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
`;

export const Header = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  text-transform: uppercase;
  font-family: inherit;
`;

export const ListInfo = styled.div`
  flex: 1 0 0;
  overflow: hidden;
`;

export const ListName = styled.p`
  margin-bottom: 0;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
  text-transform: uppercase;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const ListDescription = styled.p`
  margin-top: ${spacing.smallPlus};
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
  text-transform: uppercase;
  margin-bottom: 0;
`;

export const PatientsSection = styled.div`
  display: flex;
  align-items: stretch;
  flex: 1;
  width: 100%;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${({ width }) => (width ? `${width}px` : `1`)} 0 0;
`;

export const SelectedUsersWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 8px;
  border: 1px solid ${palette.coolGrey2};
  font-family: inherit;
`;

export const SelectedUserRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 0.5fr auto;
  width: 100%;
  align-items: center;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.coolGrey3};
  }

  &:nth-child(even) {
    background-color: ${palette.coolGrey4};
  }
`;

export const SelectedUserCell = styled.div`
  padding: ${spacing.small};
  font-family: inherit;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:first-of-type {
    padding-left: ${spacing.regular};
  }

  &:last-of-type {
    padding-right: ${spacing.regular};
  }
`;

export const EmptyListText = styled.p`
  margin-top: ${spacing.giga};
  margin-bottom: 0;
  text-align: center;
  font-family: inherit;
  color: ${palette.coolGrey2};
`;

export const DeleteIcon = styled(Close)`
  && {
    color: ${palette.coolGrey2};
    width: 20px;
    height: 20px;
  }
`;

export const OptionRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 3fr;
`;

export const OptionCell = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:not(:first-of-type) {
    padding-left: 16px;
  }
`;

export const optionHighlightStyle = {
  fontWeight: fontWeights.bold,
  background: 'none',
};
