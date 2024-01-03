import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette, { typography } from 'styles/palette';
import { fontSizes } from 'styles/font';

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

export const Placeholder = styled.div`
  width: 100%;
  color: ${palette.mediumGrey};
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
  padding: 0;
  font-family: ${typography.text};
  font-size: ${fontSizes.smallPlus};
  width: 100%;
  height: 35px;
  border-top: 1px solid ${palette.coolGrey3};
  border-bottom: 1px solid ${palette.coolGrey3};
  background-color: ${(props) =>
    props.isSelected ? palette.dockBlueLight : palette.white};

  &:hover {
    & ${TemplateHandle}, ${AddPlaceholder} {
      opacity: 1;
    }
  }

  @media print {
    border-left: 1px solid ${palette.coolGrey3};
    border-top: 1px solid ${palette.coolGrey1};
    border-bottom: 1px solid ${palette.coolGrey1};
    page-break-inside: avoid;
  }
`;

export const TaskTemplateProgressCircle = styled.div`
  margin-left: ${spacing.small};
  margin-right: ${spacing.small};
`;

export const TaskTemplateOptionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: ${spacing.smallPlus};
  position: relative;
  overflow: hidden;
`;

export const TaskTemplatePatientHeader = styled.div`
  width: 164px;
`;

export const TaskTemplateRight = styled.div`
  display: flex;
  align-items: center;
`;

export const ActionIconsContainer = styled.div`
  display: flex;
  position: relative;
  width: 65px;
  align-items: center;
  &::after {
    border-right: 1px solid ${palette.coolGrey3};
    content: '';
    position: absolute;
    top: -4px;
    left: 100%;
    width: 0px;
    height: 36px;
  }
`;

export const PatientMRNAnchor = styled.a`
  color: ${palette.brightBlue} !important;
`;
