/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Card, Grid } from '@mui/material';
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
    width: 38px;
    text-overflow: ellipsis;
  }
`;

export const ListItemLink = styled(Link)`
  color: ${palette.brightBlue};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
  padding-bottom: 1px;

  > span {
    color: ${palette.brightBlue};
    font-weight: ${fontWeights.regular};
    line-height: 1;
    transition: transform 0.4s ease-out;
    transition-delay: ${(props) => (props.isCompleted ? 0.1 : 0)}s;
    transform: translateX(${(props) => (props.isCompleted ? 0 : -100)}%);
  }
`;

export const TootipCompletedBy = styled.div`
  color: ${palette.crystalBlue};
  font-family: Outfit;
  font-weight: 400;
  font-size: 16px;
  line-height: 19.2px;
  margin-bottom: 2px;
`;

export const TootipCompletedByName = styled.div`
  color: ${palette.black};
  font-family: Outfit;
  font-weight: 400;
  font-size: 16px;
  line-height: 19.2px;
  margin-bottom: 2px;
`;

export const TootipCompletedByDate = styled.div`
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-weight: 400;
  font-size: 14px;
  line-height: 16.8px;
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
  width: 12px;
  height: 12px;
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
  opacity: ${({ isBorderColumnItem }) => (isBorderColumnItem ? 1 : 0)};

  &::first-letter {
    color: ${palette.lightGrey};
    font-size: ${fontSizes.regular};
  }

  &:hover:first-letter {
    color: ${palette.brightBlue};
  }

  &:hover {
    div {
      color: ${palette.brightBlue};
    }
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
    color: ${palette.coolGrey1};

    &:hover {
      color: ${palette.brightBlue};
      background: none;
    }
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  // width: ${({ width }) => (width ? `${width}px` : '100%')};
  &:hover {
    ${DescriptionEditButton} {
      opacity: 1;
    }
  }
  font-family: inherit;
`;

export const DescriptionInput = styled.input`
  outline: 'none';
  background-color: transparent !important;
  border: ${({ readOnly }) =>
    readOnly ? 'none' : `1px solid #D4D9DF !important`};
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
  justify-content: flex-start;
  padding-left: 10px;
  ${({ matched }) =>
    matched && `background: ${featurePalette.globalSearchHighlight};`};
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

export const SubtaskWrapper = styled.div`
  width: fit-content;
  opacity: 0;
`;

export const DetailsButton = styled.button`
  font-family: 'Outfit', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.coolGrey1};
  opacity: 0;

  &:hover {
    color: ${palette.brightBlue};
  }
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
  &:hover {
    & ${SubtaskWrapper}, & ${DetailsButton} {
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

export const DragPreviewWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: rgba(155, 217, 236, 0.6);
  color: black;
  padding: 6px 12px;
  margin-left: ${({ shouldOffsetLeft }) => (shouldOffsetLeft ? '-50px' : '0')};
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  position: relative;
  width: 350px;
  height: 34px;
  cursor: grabbing;
  user-select: none;
`;

export const DragPreviewText = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bold;
`;

export const StandardTaskItemContainer = styled.div`
  position: relative;
  background-color: ${(props) =>
    props.isSelected || props.isDragActive
      ? palette.brightBlueWithAlpha
      : // eslint-disable-next-line unicorn/no-nested-ternary
      props.hasEscalations
      ? palette.bananaHammockLight
      : // eslint-disable-next-line unicorn/no-nested-ternary
        props.customHighlight ?? palette.white};
  border-bottom: 1px solid
    ${({ isTaskOfTemplate }) =>
      isTaskOfTemplate ? palette.blueOcean : palette.coolGrey3};
  border-right: 1px solid
    ${({ isTaskOfTemplate }) =>
      isTaskOfTemplate ? palette.blueOcean : palette.coolGrey3};
  border-top: 1px solid
    ${({ isTaskOfTemplate }) =>
      isTaskOfTemplate ? palette.blueOcean : palette.coolGrey3};
  display: flex;
  justify-content: ${(props) =>
    props.isAddingTask ? 'flex-end' : 'flex-start'};
  width: 100%;
  // height: ${({ height }) => height || 35}px;
  height: 35px;
  border-left: none;
  transition: background-color 0.3s ease-out;
  animation: ${(props) =>
    props.newlyCreated
      ? css`
          ${highlight} 6s ease-out;
        `
      : ''};

  ${({ isDraggedOver, hoverBorder }) =>
    isDraggedOver
      ? hoverBorder
        ? `
      border-top: 3px solid ${palette.azureBlue};
      `
        : `
      border-bottom: 3px solid ${palette.azureBlue};
      `
      : ''}

  // ${({ isDragActive }) => (isDragActive ? 'opacity: 0;' : 'opacity: 1;')}

  ${({ isTaskTemplate }) =>
    isTaskTemplate
      ? `
  border-left: 1px solid rgba(75, 179, 253, 1);
  border-right: 1px solid rgba(75, 179, 253, 1);
  `
      : ''}

  ${({ workflowAddTask }) =>
    workflowAddTask
      ? `
  border-left: 1px solid rgba(75, 179, 253, 1);
  border-right: 1px solid rgba(75, 179, 253, 1);
  border-bottom: 1px solid rgba(75, 179, 253, 1);
  `
      : ''}

  ${({ isLastChild, isDraggedOver }) =>
    isLastChild
      ? isDraggedOver
        ? `
      border-bottom: 3px solid ${palette.azureBlue};
      `
        : `
    border-bottom: 1px solid rgba(75, 179, 253, 1);
  `
      : ''}

  &:hover {
    border-top: 1px solid ${palette.coolGrey2};

    ${({ isTaskTemplate }) =>
      !isTaskTemplate
        ? `
      border-right: 1px solid ${palette.coolGrey2};
    `
        : ``}

    ${({ isLastChild }) =>
      !isLastChild
        ? `
        border-bottom: 1px solid ${palette.coolGrey2};
      `
        : ''}

    ${({ isTaskOfTemplate }) =>
      isTaskOfTemplate ? `border: 1px solid ${palette.blueOcean}` : ``};

    ${({ workflowAddTask }) =>
      workflowAddTask
        ? `border-bottom: 1px solid ${palette.blueOcean};
           border-left: 1px solid${palette.blueOcean};
          border-right: 1px solid ${palette.blueOcean};
          `
        : ``};
  }

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
  cursor: grab;
`;

export const StandardTaskItemPanel = styled.div`
  position: relative;
  ${(props) =>
    props.$isDragging
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
    // border-top: 1px solid ${palette.coolGrey3};
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
  border-radius: 2px;
  border: 1px solid ${(property) => property.color || '#54B989'};
  background: ${(property) => `${property.color}1A` || '#54B9891A'};
  min-width: 90px;
  padding: 2.5px 2px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: ${(property) => property.color || '#54B989'};
`;

export const StatusSubContaioner = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 12px;
`;

export const PlaceholderText = styled.div`
  color: ${palette.lightGrey};

  &::first-letter {
    color: ${palette.lightGrey};
    font-size: ${fontSizes.regular};
  }

  &:hover:first-letter {
    color: ${palette.brightBlue};
  }

  &:hover {
    div {
      color: ${palette.brightBlue};
    }
    color: ${palette.brightBlue};
  }
`;

export const StatusName = styled.p`
  display: block;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 0;
  text-align: center;
  font-family: Outfit;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
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
  left: ${({ hasCustomOffset }) => (hasCustomOffset ? '-72px' : '-19px')};
  top: -1px;
  display: flex;
  align-items: center;
  z-index: 999;
  pointer-events: none;
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
  left: ${({ hasCustomOffset }) => (hasCustomOffset ? '-72px' : '-19px')};
  top: -1px;
  z-index: 999;
  pointer-events: none;
`;

export const SubtasksCellContentButton = styled.button`
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: ${({ isOpen, isGreyedOut }) => {
    if (isGreyedOut) return palette.coolGrey2;

    // return isOpen ? palette.brightBlue : palette.coolGrey1;
    return palette.coolGrey1;
  }};

  &:disabled {
    color: ${palette.coolGrey2};
    cursor: initial;
  }
  // p {
  //    visibility: ${({ subTasksCount }) =>
    subTasksCount > 0 ? 'hidden' : 'visible'};
  // }

  &:hover {
    color: ${({ isOpen, subtasksDisabled }) =>
      subtasksDisabled ? '' : palette.brightBlue};
    //   p {
    //     visibility: visible;
    //   }
  }
`;

export const SubtasksCellText = styled.p`
  margin-right: ${spacing.tiny};
  margin-bottom: 0;
  // font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: inherit;
  font-family: Roboto Condensed;
  font-size: 12px;
  // font-weight: 400;
  line-height: 14.06px;
  text-align: right;
`;

export const SubtasksCountText = styled.span`
  margin-right: ${spacing.tiny};
  margin-bottom: 0;
  // font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: inherit;
  font-family: Roboto Condensed;
  font-size: 12px;
  // font-weight: 400;
  line-height: 14.06px;
  text-align: right;
`;

export const ParentTaskContainer = styled.div`
  &:not(:last-child) {
    margin-bottom: ${({ noMargin, origin }) =>
      noMargin ? -1 : origin === 'PATIENT' || origin === 'GLOBAL' ? 2 : 0}px;
  }
  width: ${({ $width }) => ($width ? '100%' : '')};
  padding-right: ${({
    $width,
    $isVirtualSubtask,
    $isWorkflowTask,
    disableRightOffset,
  }) =>
    $width
      ? $isVirtualSubtask
        ? disableRightOffset
          ? '0px'
          : '15.5px'
        : $isWorkflowTask
        ? disableRightOffset
          ? '0px'
          : '66px'
        : disableRightOffset
        ? '0px'
        : '66.5px'
      : ''};
`;

export const TaskContainer = styled.div``;

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
  margin-left: 20px;
`;

export const PatientLabel = styled.span`
  color: ${palette.brightBlue};
  font-weight: ${fontWeights.light};
  font-size: 0.65 rem;
`;

export const DisabledPatientLabel = styled(PatientLabel)`
  opacity: 0.5;
  cursor: not-allowed;
`;

export const DateText = styled.p`
  margin-bottom: 0;
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
  position: relative;
  overflow: hidden;
`;

export const DisabledLink = styled.span``;

export const ActionIconsContainer = styled.div`
  display: flex;
  position: relative;
  height: -webkit-fill-available;
  width: 65px;
  padding-right: 4px;
  align-items: center;

  border-right: 1px solid ${palette.coolGrey3};
`;

export const PatientMRNAnchor = styled.a`
  color: ${palette.brightBlue} !important;
`;

export const TaskScrollVericleLine = styled.div`
  background: ${({ highlightFirstColumnRightBorder }) =>
    highlightFirstColumnRightBorder ? palette.azureBlue : '#48bbb3'};
  line-height: 36px;
  height: 100%;
  width: 2.5px;
  box-shadow: 1px 0px 3px 0px rgba(0, 0, 0, 0.21);
  z-index: 10;
`;

export const ChildTaskTitle = styled.div`
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 16.8px;
  margin: 8px 8px 2px 6px;
  padding: 2px;
`;

export const WorkflowTitle = styled.div`
  color: ${palette.black};
  margin: 4px 4px 0px 6px;
  text-align: left;
  font-family: Outfit;
  font-size: 16px;
  font-weight: 400;
  line-height: 19.2px;
`;

export const ParentTaskLink = styled.div`
  color: ${palette.crystalBlue};
  font-family: Outfit;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19.2px;
  cursor: pointer;
  margin: 2px 6px 8px 6px;
  padding: 2px;
`;

export const AssigneeWrapper = styled.div`
  opacity: ${({ isBorderColumnItem }) => (isBorderColumnItem ? 1 : 0)};
`;

export const AssigneeContainer = styled.div`
width: 100%;
&:hover {
  & ${AssigneeWrapper} {
    opacity: 1;
  }
`;

export const PatientWrapper = styled.div`
  width: fit-content;
  opacity: 0;
`;

export const PatientContainer = styled.div`
width: 100%;
&:hover {
  & ${PatientWrapper} {
    opacity: 1;
  }
`;
export const WorkflowStatusWrapper = styled.div`
  width: fit-content;
  opacity: 0;
`;

export const StatusContainer = styled.div`
width: 100%;
&:hover {
  & ${WorkflowStatusWrapper} {
    opacity: 1;
  }
`;
export const LabelWrapper = styled.div`
  width: fit-content;
  opacity: ${({ isBorderColumnItem }) => (isBorderColumnItem ? 1 : 0)};
`;

export const LabelContainer = styled.div`
width: 100%;
&:hover {
  & ${LabelWrapper} {
    opacity: 1;
  }
`;
export const FilesWrapper = styled.div`
  width: fit-content;
  opacity: ${({ attachments, isBorderColumnItem }) =>
    attachments || isBorderColumnItem ? 1 : 0};
`;

export const FilesContainer = styled.div`
width: 100%;
&:hover {
  & ${FilesWrapper} {
    opacity: 1;
  }
`;
export const StartDateWrapper = styled.div`
  width: fit-content;
  opacity: 0;
`;

export const StartDateContainer = styled.div`
width: 100%;
&:hover {
  & ${StartDateWrapper} {
    opacity: 1;
  }
`;
export const DueDateWrapper = styled.div`
  width: fit-content;
  opacity: ${({ isBorderColumnItem }) => (isBorderColumnItem ? 1 : 0)};
`;

export const DueDatesContainer = styled.div`
width: 100%;
&:hover {
  & ${DueDateWrapper} {
    opacity: 1;
  }
`;
export const ShareWrapper = styled.div`
  width: fit-content;
  opacity: 0;
`;

export const ShareContainer = styled.div`
width: 100%;
&:hover {
  & ${ShareWrapper} {
    opacity: 1;
  }
`;
export const CommentsWrapper = styled.div`
  width: fit-content;
  opacity: ${({ hasComments, isBorderColumnItem }) =>
    hasComments || isBorderColumnItem ? 1 : 0};
`;

export const CommentsContainer = styled.div`
width: 100%;
&:hover {
  & ${CommentsWrapper} {
    opacity: 1;
  }
`;

export const PatientLableContainer = styled.div`
  display: flex;
  items-align: center;
`;

export const AISummaryWrapperSubtask = styled.div`
  margin: 8px 5px 0 2px;
`;

export const AISummaryWrapper = styled.div`
  margin: 0 5px 0 2px;
`;
