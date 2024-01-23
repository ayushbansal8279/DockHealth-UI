import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  min-height: 56px;
  width: 100%;
  font-family: inherit;
  color: ${palette.mediumGrey};
`;

export const Placeholder = styled.p`
  position: absolute;
  margin-bottom: 0;
  top: 50%;
  left: ${spacing.large};
  transform: translateY(-50%);
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  font-family: inherit;
`;

export const SelectElementWrapper = styled.div`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : `calc(100% - 130px)`)};
  max-height: 132px;
  overflow-y: auto;
  z-index: 1;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  &::-webkit-scrollbar:vertical {
    width: 11px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${palette.coolGrey4};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid ${palette.coolGrey4};
    background-color: ${palette.coolGrey1};
  }

  ${({ withValue }) =>
    withValue &&
    `
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
  `}
`;

export const SelectElement = styled.button`
  position: relative;
  width: 100%;
  padding: ${spacing.smallPlus} ${spacing.regularPlus} ${spacing.tiny}
    ${spacing.regularPlus};
  background: ${palette.coolGrey4};
  text-align: left;
  cursor: text;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 130px;
  height: 56px;
  padding: 0 ${spacing.smallPlus};
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  background: ${palette.coolGrey4};
`;

export const MemberItemWrapper = styled.div`
  position: relative;
  display: inline-block;
  padding: ${spacing.tiny} ${spacing.large} ${spacing.tiny} ${spacing.tiny};
  margin-right: ${spacing.small};
  margin-bottom: ${spacing.small};
  border: 0.5px solid ${palette.coolGrey2};
`;

export const MemberName = styled.p`
  display: inline-block;
  margin-bottom: 0;
  line-height: 1.4;
  font-family: inherit;
  color: ${palette.mediumGrey};
`;

export const RemoveMemberButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: ${spacing.tiny};
  width: 12px;
  height: 12px;
`;

export const RemoveMemberIcon = styled(CloseIcon)`
  && {
    width: 100%;
    height: 100%;
    color: ${palette.mediumGrey};
    cursor: pointer;
  }
`;

export const SearchInput = styled.input`
  display: inline-block;
  max-width: 100%;
  width: 20px;
  padding: ${spacing.tiny};
  margin-bottom: 10px;
  line-height: 1.4;
  font-family: inherit;
  color: ${palette.mediumGrey};
  outline: none;
  border: none;
  background: transparent;

  &:disabled {
    background: transparent;
  }
`;

export const AvailablePeopleWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : `calc(100% - 130px)`)};
  max-height: 165px;
  overflow-y: auto;
  background: ${palette.white};
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
  z-index: 100;
  padding: ${spacing.smallPlus} 0;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  &::-webkit-scrollbar:vertical {
    width: 11px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${palette.white};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid ${palette.white};
    background-color: ${palette.coolGrey1};
  }
`;

export const AvailablePeopleItemButton = styled.button`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.smallPlus} ${spacing.smallPlus} ${spacing.smallPlus}
    ${spacing.regularPlus};
  cursor: pointer;

  ${({ isHovered }) => isHovered && `background-color: ${palette.coolGrey4};`}
`;

export const UserName = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding-right: ${spacing.regular};
  overflow: hidden;
`;

export const UserNameText = styled.p`
  margin-bottom: 0;
  font-family: inherit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  color: ${palette.mediumGrey};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EmptyPeopleResult = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${spacing.smallPlus} ${spacing.giga} ${spacing.smallPlus}
    ${spacing.regularPlus};
  font-family: inherit;
`;

export const EmptyResultText = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  color: ${palette.black};
  font-family: inherit;
`;

export const EmptyResultButton = styled.button`
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  font-family: inherit;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
