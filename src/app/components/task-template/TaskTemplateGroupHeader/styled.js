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
  font-family: inherit;
  font-size: ${fontSizes.smallPlus};
  width: 100%;
  height: 37px;
  background-color: ${(props) =>
    props.isSelected ? palette.dockBlueLight : palette.white};

  border-top: 2px solid rgba(75, 179, 253, 1);
  margin-top: 10px;

  margin-bottom: ${({
    isOpen,
    isNextVirtualTaskItemTypeBundle,
    isLastTaskOfGroup,
    origin,
    isNextTaskItemTypeBundle,
  }) =>
    isOpen
      ? origin === 'DASHBOARD' && '10px'
      : origin === 'LIST' || origin === 'PATIENT'
      ? isLastTaskOfGroup
        ? '0px'
        : isNextVirtualTaskItemTypeBundle || isNextTaskItemTypeBundle
        ? '0px'
        : '10px'
      : '10px'};

  border-bottom: 1px solid
    ${({ isOpen, origin }) =>
      isOpen
        ? origin === 'DASHBOARD'
          ? 'rgba(75, 179, 253, 1)'
          : `${palette.coolGrey3}`
        : 'rgba(75, 179, 253, 1)'};

  border-right: 1px solid rgba(75, 179, 253, 1);
  z-index: 2;

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
  height: -webkit-fill-available;
  width: 78px;
  align-items: center;
  padding-left: 8px;
  margin-left: -12px;
  margin-right: 0px;
  background-color: ${palette.lightOceanBlue};

  border: 5px solid ${palette.lightOceanBlue};

  border-right: 1px solid ${palette.coolGrey3};
`;

export const PatientMRNAnchor = styled.a`
  color: ${palette.brightBlue} !important;
`;
export const ChevronContainer = styled.div`
  margin-left: 20px;
`;
