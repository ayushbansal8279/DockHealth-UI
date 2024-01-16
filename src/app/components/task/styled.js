/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette, { featurePalette, typography } from 'styles/palette';
import Select from 'components/common/Select/Select';

export const highlight = keyframes`
  0% {
      background: ${palette.brightBlueWithAlpha};
  }
  100% {
      background: ${palette.white};
  }
`;

export const highlightDescription = keyframes`
  0% {
      background: #e0eff9;
  }
  100% {
      background: ${palette.white};
  }
`;

export const DecisionSelect = styled(Select)`
  & .MuiSelect-root {
    padding: 0px;
    background: white;
  }
  & .MuiSelect-root:before {
    display: none;
  }
  & .switchIcon > path {
    fill: ${(props) => props.iconColorActive ?? palette.dirtyBanana};
  }
  & .MuiSelect-select {
    padding: 0px;
    background-color: white;
  }
`;

export const ListItemLink = styled(Link)`
  color: ${palette.mediumGrey};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &:hover {
    color: ${palette.brightBlue};
    text-decoration: underline;
  }
`;

export const PublicInfoWrapper = styled.span`
  padding-left: ${spacing.small};
`;

export const ListLink = styled(ListItemLink)`
  max-height: 2.6rem;
  overflow: hidden;
`;

export const CompletedBy = styled.div`
  align-items: flex-end;
  display: flex;
  height: ${(props) => (props.isCompleted ? 0.8 : 0)}rem;
  overflow: hidden;
  transition: all 0.1s ease-out;
  transition-delay: ${(props) => (props.isCompleted ? '0' : '0.4')}s;
  font-size: ${fontSizes.small};
  padding-left: 5px;
  padding-bottom: 0px;

  > span {
    color: ${palette.brightBlue};
    font-weight: ${fontWeights.regular};
    line-height: 1;
    transition: transform 0.4s ease-out;
    transition-delay: ${(props) => (props.isCompleted ? 0.1 : 0)}s;
    transform: translateX(${(props) => (props.isCompleted ? 0 : -100)}%);
  }
`;

export const TaskContext = styled.div`
  align-items: flex-end;
  display: flex;
  overflow: hidden;
  font-size: ${fontSizes.small};
  padding-left: 5px;
  padding-bottom: 2px;

  > span {
    color: ${palette.brightBlue};
    font-weight: ${fontWeights.regular};
    line-height: 1;
  }
`;

export const PrioritySwitch = styled.button`
  position: absolute;
  top: 50%;
  left: ${(props) => props.left || '-12px'};
  transform: translateY(-50%);
  cursor: ${({ isClickable = true }) => (isClickable ? 'pointer' : 'initial')};
`;

export const PriorityIndicator = styled.div`
  width: 2px;
  height: 100%;
  background-color: ${({ color }) => color};
  position: absolute;
  left: 0;
`;

export const DependencyIconContainer = styled.div`
  margin-right: ${spacing.small};
`;

export const BulkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ visible }) => (visible ? '1' : '0.5')};
  &:hover {
    opacity: 1;
  }
`;

export const AddPlaceholder = styled.div`
  color: ${palette.lightGrey};
  opacity: 0;
  &::first-letter {
    color: ${palette.orange};
    font-size: ${fontSizes.regular};
  }

  &:hover {
    color: ${palette.brightBlue};
  }
`;

export const CircleIcon = styled.img`
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'initial')};
  margin-right: ${spacing.smallPlus};
  align-self: center;
  ${({ isCompleted }) => !isCompleted && `margin-left: 2px;`}
  opacity: ${({ isClickable }) => (isClickable ? '1' : '0.5')};
`;

export const DescriptionTooltipWrapper = styled.div`
  display: block;
  width: 100%;
  padding: ${spacing.small};
  color: ${palette.white};
  background: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  cursor: initial;
`;

export const Description = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-right: 4px;
  overflow-wrap: anywhere;
  ${(props) => (props.isCrossedOut ? 'text-decoration: line-through;' : '')}
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: initial;
  max-width: 480px;
  font-weight: 400;
  font-size: 14px;
  ${(props) => (props.isUnread ? 'font-weight: 900; font-size: 15px;' : '')};
  overflow: hidden;
  &:hover > div > div > button {
    visibility: visible;
  }

  @media screen and (max-width: 1300px) {
    max-width: 300px;
  }

  @media screen and (min-width: 1680px) {
    max-width: 600px;
  }

  @media screen and (min-width: 2100px) {
    max-width: 900px;
  }

  @media screen and (min-width: 2500px) {
    max-width: 1100px;
  }
`;

export const MemberGroupContainer = styled.div`
  margin-right: ${spacing.small};
`;

export const AssignMemberIconContainer = styled.div`
  cursor: pointer;
`;

export const DescriptionEditButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 8px;
  border-radius: 3px;
  opacity: 0;

  & .MuiIconButton-root {
    max-height: 24px;
    margin: 0;
    color: ${palette.brightBlue};
  }

  & .MuiSvgIcon-root {
    width: 14px;
    height: 14px;
  }
`;

export const DescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: pointer;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  &:hover {
    ${DescriptionEditButton} {
      opacity: 1;
    }
  }
  font-family: ${typography.text};
`;

export const DescriptionInput = styled.input`
  outline: 'none';
  background-color: transparent !important;
  border: ${({ readOnly }) =>
    readOnly ? 'none' : `1px solid ${palette.brightBlue} !important`};
  border-radius: '4px';
  color: ${palette.mediumGrey};
  width: 1005px;
  text-overflow: 'ellipsis';

  &:focus {
    outline: none !important;
    border: none;
  }
`;

export const DecisionBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  cursor: pointer;
`;

export const DueDateAddLabel = styled.p`
  display: none;
  position: absolute;
  bottom: -22px;
  margin-bottom: 0;
  text-align: center;
  color: ${palette.brightBlue};
  font-weight: ${fontWeights.light};
  font-size: ${fontSizes.regular};
`;

export const DueDate = styled.span`
  bottom: 1px;
  color: ${palette.white};
  font-size: ${fontSizes.small};
  position: absolute;
  text-align: center;
  line-height: initial;
`;

export const DueDateBasicLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px ${spacing.tiny};
  border-radius: 6px;
  background: ${({ isOverdue }) => (isOverdue ? '#e84739' : '#949aa4')};
  color: ${palette.white};
  font-size: ${fontSizes.small};
`;

export const DueDateContainer = styled.div`
  position: relative;
  display: flex;
  width: 37.98px; // per design
  justify-content: center;
  text-align: center;

  &:hover {
    ${DueDateAddLabel} {
      display: block;
    }
  }
`;

export const GridImg = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ matched }) =>
    matched && `background: ${featurePalette.globalSearchHighlight};`}
`;

export const SmallText = styled.span`
  color: ${palette.coolGrey2};
  font-size: ${fontSizes.small};
`;

export const SubtasksGroupLabel = styled.span`
  color: ${palette.lightGray};
  font-size: ${fontSizes.regular};
  cursor: pointer;
  margin-right: ${spacing.regularPlus};
  width: 200px;
`;

export const StandardTaskItemCell = styled.div`
  align-items: ${({ alignItems }) => alignItems || 'center'};
  border-right: 1px solid ${palette.coolGrey3};
  color: ${(props) => props.color || palette.mediumGrey};
  display: flex;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${(props) =>
    props.bolded ? fontWeights.regular : fontWeights.light};
  color: ${palette.mediumGrey};
  min-width: ${({ width, isSubtask, order }) =>
    isSubtask && order === 0 ? +width - 0 : width}px;
  max-width: ${({ width, isSubtask, order }) =>
    isSubtask && order === 0 ? +width - 0 : width}px;
  padding: ${spacing.small} 0;
  padding: ${(props) => props.padding || `${spacing.small} 0`};
  padding-left: ${spacing.small};
  padding-right: ${spacing.small};
  width: ${(props) => (props.width ? '' : '100%')};
  justify-content: ${(props) => props.justify || 'flex-start'};
  position: relative;
`;

export const MainStandardTaskItemCell = styled(StandardTaskItemCell)`
  flex: 1;
  ${({ order }) => (order === 0 ? 'border: transparent;' : ``)}
  ${({ order }) => (order ? `order: ${order};` : '')}
  &:hover button {
    visibility: visible;
  }
  @media print {
    min-width: ${(props) => props.printWidth};
    height: 100%;
  }
`;

export const ClickablePatient = styled.span`
  align-self: center;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const StandardTaskItemContainer = styled.div`
  position: relative;
  background-color: ${(props) =>
    props.isSelected
      ? palette.brightBlueWithAlpha
      : // eslint-disable-next-line unicorn/no-nested-ternary
      props.hasEscalations
      ? palette.bananaHammockLight
      : // eslint-disable-next-line unicorn/no-nested-ternary
      props.customHighlight
      ? props.customHighlight
      : palette.white};
  border: 1px solid ${palette.coolGrey3};
  border-right: none;
  display: flex;
  justify-content: ${(props) =>
    props.isAddingTask ? 'flex-end' : 'flex-start'};
  width: 100%;
  height: ${({ height }) => height || 35}px;
  border-top: none;
  border-left: none;
  transition: background-color 0.3s ease-out;
  animation: ${(props) =>
    props.newlyCreated
      ? css`
          ${highlight} 6s ease-out;
        `
      : ''};

  @media print {
    border-left: 1px solid ${palette.coolGrey3};
    height: auto;
    border: 1px solid ${palette.coolGrey1};
    page-break-inside: avoid;
  }
`;

export const StatusBar = styled.div`
  background-color: ${(props) => props.color};
  height: calc(100% - 2px);
  top: 0;
  left: 0;
  position: absolute;
  width: 6px;
  top: 50%;
  transform: translateY(-50%);
`;

export const TaskIconsBox = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`;

export const ThreeDots = styled.img`
  position: absolute;
  left: ${spacing.smallPlus};
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  cursor: pointer;

  &:active {
    opacity: 1;
  }
`;

export const StandardTaskThreeDots = styled(ThreeDots)`
  left: -12px;
  background-color: ${palette.coolGrey4};
  padding: 2px 1px 2px 2px;
  z-index: 12;
`;

export const StandardTaskItemPanel = styled.div`
  position: relative;
  ${(props) =>
    props.isDragging
      ? 'box-shadow: 0px 0px 11px rgba(204, 204, 204, 0.8)'
      : ''};

  &:hover {
    & ${ThreeDots}, & ${AddPlaceholder} {
      opacity: 1;
    }
  }

  &:before {
    position: absolute;
    top: -1px;
    right: 0;
    display: block;
    width: 100%;
    content: '';
    border-top: 1px solid ${palette.coolGrey3};
    z-index: 1;
  }
`;

export const TaskItemParentTaskLabel = styled.div`
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey2};
  font-size: ${fontSizes.small};

  & > span {
    color: ${palette.brightBlue};
    cursor: pointer;
  }
`;

export const StatusWrapper = styled.div`
  display: flex;
`;

export const StatusName = styled.p`
  display: block;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 0;
  text-align: left;
`;

export const MatchingWrapper = styled.div`
  height: 100%;
  width: 100%;
  ${({ matched }) =>
    matched && `background: ${featurePalette.globalSearchHighlight};`}
`;

export const AssigneeMatchingWrapper = styled(MatchingWrapper)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  height: 75%;
`;

export const SubtaskStylingLinkContainer = styled.div`
  height: calc(2px + 100%);
  width: 18px;
  position: absolute;
  left: -19px;
  top: -1px;
  display: flex;
  align-items: center;
  z-index: 1;
`;

export const SubtaskStylingVerticalPart = styled.div`
  width: 0.5px;
  height: 100%;
  background-color: ${palette.coolGrey2};
  padding: 1px 0;
  z-index: 1;
`;

export const SubtaskStylingHorizontalPart = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${palette.coolGrey2};
  z-index: 1;
`;

export const SubtaskStylingLastLink = styled.div`
  height: calc(1px + 50%);
  width: 18px;
  border: 1px solid ${palette.coolGrey2};
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 4px;
  position: absolute;
  padding: 1px 0;
  left: -19px;
  top: -1px;
  z-index: 1;
`;

export const SubtasksCellContentButton = styled.button`
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: ${({ isOpen, isGreyedOut }) => {
    if (isGreyedOut) return palette.coolGrey2;

    return isOpen ? palette.brightBlue : palette.coolGrey1;
  }};

  &:disabled {
    color: ${palette.coolGrey2};
    cursor: initial;
  }
`;

export const SubtasksCellText = styled.p`
  margin-right: ${spacing.tiny};
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: inherit;
`;

export const ParentTaskContainer = styled.div`
  &:not(:last-child) {
    margin-bottom: ${({ noMargin }) => (noMargin ? -1 : 3)}px;
  }
`;

export const SubtasksWrapper = styled.div`
  position: relative;
  padding-left: ${spacing.giga};
`;

export const SubtaskItemWrapper = styled.div`
  position: relative;
`;

export const AddSubtaskButton = styled.button`
  cursor: pointer;
  &:hover div {
    visibility: visible;
  }
`;

export const TaskItemDescriptionIndicators = styled.div`
  display: flex;
  align-items: baseline;
  margin-left: 5px;
`;

export const PatientLabel = styled.span`
  color: ${palette.mediumGrey};
  font-weight: 700;
  font-weight: ${fontWeights.bold};
  font-size: 0.65 rem;

  &:hover {
    color: ${palette.brightBlue};
    text-decoration: underline;
  }
`;

export const DisabledPatientLabel = styled(PatientLabel)`
  opacity: 0.5;
  cursor: not-allowed;
`;

export const DateText = styled.p`
  margin-bottom: 0;
`;

export const DetailsButton = styled.button`
  margin-left: 8px;
  visibility: hidden;
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.brightBlue};
`;

export const DescriptionBorder = styled.div`
  display: flex;
  ${({ isEdited }) => (isEdited ? 'padding: 4px 8px;' : 'padding: 2px 8px;')}
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  width: 100%;
  ${({ disabled }) => (disabled ? 'border: 0px;' : '')}
  ${({ isEdited }) => isEdited && `border-color: ${palette.coolGrey2};`}
`;

export const PatientPrintAdditionalInfo = styled.div`
  display: none;
  @media print {
    display: initial;
  }
`;

export const DecisionCellContainer = styled.div`
  height: 34px;
  width: 120px;
  display: flex;
  align-items: center;
  border-left: 1px solid ${palette.coolGrey3};
  padding-left: 10px;
  margin-left: 8px;
`;

export const DisabledLink = styled.span``;

export const ActionIconsContainer = styled.div`
  display: flex;
  position: relative;
  width: 65px;
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

export const TaskScrollVericleLine = styled.div`
  background: #48BBB3; 
  height: 100%;
  width: 1px;
  box-shadow: 1px 0px 3px 0px rgba(0, 0, 0, 0.21);
`;