import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 56px;
  width: 100%;
  font-family: 'Roboto Condensed', sans-serif;
  color: ${palette.mediumGrey};
`;

export const PlaceholderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
`;

export const Placeholder = styled.p`
  margin-bottom: 0;
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  font-family: inherit;
`;

export const SelectElement = styled.button`
  width: calc(100% - 130px);
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
  margin-bottom: ${spacing.small};
  line-height: 1.4;
  font-family: inherit;
  color: ${palette.mediumGrey};
  outline: none;
  border: none;
  background: transparent;
`;
