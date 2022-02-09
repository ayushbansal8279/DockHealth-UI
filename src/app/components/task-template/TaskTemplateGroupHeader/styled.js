import styled, { keyframes, css } from 'styled-components';
import { Collapse } from '@material-ui/core';
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

  &:active {
    opacity: 1;
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
  display: flex;
  /* align-items: center; */
  /* justify-content: space-between; */
  padding: 0;
  border-top: 1px solid ${palette.coolGrey3};
  background-color: ${palette.white};
  font-family: 'Roboto', sans-serif;
  font-size: ${fontSizes.smallPlus};
  flex: 1;

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

export const DescriptionStickyColumnContainer = styled.div`
  display: flex;
  width: 100%;
  position: sticky;
  left: 24px;
  z-index: 11;
  border-right: 1px solid ${palette.coolGrey3};
  border-left: 1px solid ${palette.coolGrey3};
  min-width: 500px;
  align-items: center;
  flex: 0; //TODO: temporary, to correct!
  padding-left: ${spacing.smallPlus};

  ${({ isEditingDescription }) => isEditingDescription && `z-index: 12;`}

  &::before {
    content: '';
    display: block;
    background: ${({ backgroundColor }) =>
      backgroundColor || palette.coolGrey4};
    position: absolute;
    left: -101px;
    top: 50%;
    transform: translateY(-50%);
    width: 100px;
    height: calc(100% + 6px);
    z-index: -1;
  }

  &::after {
    content: '';
    display: block;
    background-color: ${props =>
      props.isSelected ? '#e0eff9' : palette.white};
    transition: background-color 0.3s ease-out;
    position: absolute;
    left: 0px;
    top: 50%;
    width: 100%;
    height: calc(100% - 2px);
    z-index: -1;
    transform: translateY(-50%);
    animation: ${props =>
      props.newlyCreated
        ? css`
            ${highlightDescription} 6s ease-out;
          `
        : ''};
  }
`;

export const StandardWorkflowHeaderItemCell = styled.div`
  align-items: ${({ alignItems }) => alignItems || 'center'};
  border-right: 1px solid ${palette.coolGrey3};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: ${palette.mediumGrey};
  min-width: ${props => props.width};
  max-width: ${props => props.width};
  background-color: ${props => props.color};
  width: ${props => (!props.width ? '100%' : '')};
  justify-content: ${props => props.justify || 'flex-start'};
  display: flex;
  position: relative;

  &:last-of-type {
    border-right: 0;
  }
`;
