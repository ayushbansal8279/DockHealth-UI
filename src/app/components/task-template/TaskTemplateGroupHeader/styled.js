import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const TemplateHandle = styled.img`
  position: absolute;
  top: 50%;
  left: -12px;
  transform: translateY(-50%);
  background-color: transparent;
  padding: ${spacing.regular} ${spacing.tiny} ${spacing.regular} 0;
  opacity: 0;
  z-index: 12;

  &:active {
    opacity: 1;
  }
`;

export const ClickablePatient = styled.span`
  align-self: center;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const PatientLabel = styled.span`
  color: ${palette.mediumGrey};

  &:hover {
    color: ${palette.brightBlue};
    text-decoration: underline;
  }
`;

export const Placeholder = styled.div`
  width: 100%;
  color: ${palette.mediumGrey};
  padding: 0 ${spacing.regular};
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 400;

  &:hover {
    color: ${palette.brightBlue};
  }
`;

export const AddPlaceholder = styled(Placeholder)`
  color: ${palette.lightGrey};
  opacity: 0;

  &::first-letter {
    color: ${palette.orange};
    font-size: 16px;
  }
`;

export const TaskTemplateGroupHeaderContainer = styled.div`
  position: relative;
  display: flex;
  /* align-items: center; */
  /* justify-content: space-between; */
  padding: 0;
  font-family: 'Roboto', sans-serif;
  font-size: ${fontSizes.smallPlus};
  width: 100%;
  border-top: 1px solid ${palette.coolGrey3};
  border-bottom: 1px solid ${palette.coolGrey3};
  background-color: ${palette.white};

  &:hover {
    & ${TemplateHandle}, ${AddPlaceholder} {
      opacity: 1;
    }
  }
`;

export const TaskTemplateProgressCircle = styled.div`
  margin-right: ${spacing.small};
`;

export const TaskTemplateGroupHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  padding-right: 60px;
`;

export const TaskTemplateOptionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: ${spacing.smallPlus};
  width: 164px;
  position: relative;
  overflow: hidden;
`;

export const TaskTemplateNameInput = styled.input`
  width: 100%;
  margin-bottom: 0;
  padding: ${spacing.small};
  color: ${({ error }) => (error ? palette.error : palette.mediumGrey)};
  font-weight: ${fontWeights.regular};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: transparent;
  border: 1px solid
    ${({ error }) => (error ? palette.error : palette.coolGrey2)};
  border-radius: 5px;
  background: ${palette.coolGrey4};
  margin-left: ${spacing.small};

  &[readonly] {
    background-color: transparent;
    cursor: initial;
    outline: none;
    border: none;
  }

  &:focus {
    outline: none;
  }
`;

export const TaskTemplatePatientHeader = styled.div`
  width: 164px;
`;

export const TaskTemplateRight = styled.div`
  display: flex;
  align-items: center;
`;

export const NameTooltip = styled.div`
  display: block;
  width: 100%;
  padding: ${spacing.small};
  color: ${palette.white};
  background: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  cursor: initial;
`;

export const NameContainer = styled.div`
  display: flex;
  flex: 1;
`;
