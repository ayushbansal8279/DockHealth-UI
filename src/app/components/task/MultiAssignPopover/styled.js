import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const Input = styled.input`
  border: none;
  width: 100%;
  outline: none;
  margin-left: ${spacing.tiny};
`;

export const InputBox = styled.div`
  display: flex;
  padding: ${spacing.smallPlus} ${spacing.smallPlus};
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  font-family: 'Roboto Condensed', sans-serif;

  &:placeholder {
    color: ${palette.coolGrey2};
  }
`;

export const ListContainer = styled.div`
  max-height: 264px;
  overflow-y: auto;
`;

export const NoRecordsText = styled.div`
  height: 36px;
  color: ${palette.mediumGrey};
  padding-left: ${spacing.smallPlus};
`;

export const ListContentSection = styled.div`
  height: auto;
  width: 100%;
  padding: ${spacing.tiny};
  border-top: 1px solid ${palette.coolGrey3};
`;

export const MemberRow = styled.button`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${spacing.tiny} ${spacing.small};
  border-radius: 4px;
  color: ${({ isSelected }) =>
    isSelected ? palette.mediumGrey : palette.coolGrey1};
  background-color: ${({ isSelected }) =>
    isSelected ? `${palette.brightBlue}12` : 'transparent'};
  font-family: 'Roboto Condensed', sans-serif;
  cursor: pointer;

  &:not(:last-of-type) {
    margin-bottom: ${spacing.tiny};
  }

  &:hover {
    background-color: rgba(193, 204, 218, 0.25);
  }
`;

export const MemberName = styled.p`
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  margin-bottom: 0;
`;

export const UnassignedIcon = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid ${palette.coolGrey2};

  &:after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 3px;
    content: '';
    background-color: ${palette.coolGrey2};
    transform: translate(-50%, -50%);
  }
`;

export const MemberRowSkeletonLoader = styled(MemberRow)`
  height: 36px;
  width: 100%;
  border-radius: 4px;
  background-color: ${palette.skeletonLoader};

  &:not(:last-of-type) {
    margin-bottom: ${spacing.tiny};
  }
`;

export const highlightStyle = {
  fontSize: fontSizes.bold,
  background: 'none',
};

export const CheckboxSpacing = styled.div`
  width: 12px;
  height: 12px;
`;
