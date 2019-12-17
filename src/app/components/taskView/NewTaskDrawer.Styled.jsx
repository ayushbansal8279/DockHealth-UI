import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import styled from 'styled-components';

export const NewTaskDrawerContainer = styled.div`
  align-items: flex-start;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 5.5rem);
  height: min-content;
  justify-content: flex-start;
  padding: 0 0.25rem;
  position: sticky;
  transition: all 0.25s ease-out;
  top: 6.25rem;
`;

export const ParentInfoContainer = styled.div`
  background-color: white;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  width: 100%;
`;

export const ParentRead = styled.div`
  color: #d9036b;
  font-size: 0.625rem;
`;

export const ParentDescription = styled.div`
  color: #303538;
  font-size: 1.25rem;
  font-weight: bold;
`;

export const SubtaskInfoContainer = styled(ParentInfoContainer)`
  align-items: center;
  background-color: #d4f3ff;
  border-top: 0.125rem solid transparent;
  ${props => props.topBorderActive && 'border-top-color: #d9036b;'}
  display: flex;
  justify-content: space-between;
  position: relative;
  transition: border-top-color 0.25s ease-out;
`;

export const SubtaskLabel = styled.div`
  color: #303538;
  font-size: 1.25rem;
  line-height: 1;
  height: 1.25rem;
`;

export const SubtaskCloseContainer = styled.div`
  color: rgba(48, 53, 56, 0.54);
  cursor: pointer;
  font-size: 2rem;
`;

export const TopLabel = styled.div`
  color: #000;
  font-size: 24px;
  line-height: 44px;
  margin-bottom: 0.75rem;
  padding-left: 1rem;
  padding-top: 0.75rem;
`;

export const FormSectionNoBorder = styled(Grid)`
  margin-top: 5px;
  padding: 0 8px 8px;

  &:not(:first-child) {
    margin-top: 8px;
  }
`;

export const FormSectionDivider = styled.div`
  background-color: ${props => (props.active ? '#d9036b' : '#ddf2f7')};
  height: ${props => (props.shown ? '0.0625rem' : 0)};
  position: relative;
  transition: background-color 0.25s ease-out;
  width: 100%;

  ${props => props.condensed && 'margin: 0 0.5rem;'}
`;

const FormSectionElement = ({
  classes,
  className,
  topBorderActive,
  ...props
}) => {
  const newClassName = `${classes.root} ${
    topBorderActive ? classes.topBorderActive : ''
  } ${className ?? ''}`.trim();

  return <FormSectionNoBorder className={newClassName} {...props} />;
};

const formSectionStyles = {
  root: {
    backgroundColor: '#fff',
    border: '2px solid #ddf2f7',
    transition: 'border 0.25s ease-out',
  },
  topBorderActive: {
    borderTopColor: '#d9036b',
  },
};

export const FormSection = withStyles(formSectionStyles)(FormSectionElement);

export const CondensedFormSection = styled(FormSection)`
  padding: 0;
`;

export const StatusSelect = styled.div`
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  flex-flow: row nowrap;

  & > * {
    font-size: 14px;
    margin-left: 6px;
  }
`;

export const CloseTaskButtonContainer = styled.div`
  align-items: center;
  display: flex;
  height: 3rem;
  justify-content: center;
  padding-right: 0.5rem;
`;

export const StyledButton = styled(Button)`
  && {
    ${props => props.variant === 'contained' && 'background-color: #007cab;'}
    box-shadow: none;
    color: ${props => (props.variant === 'contained' ? '#fff' : '#009fcd')};
    font-size: ${props => (props.variant === 'contained' ? 1 : 0.875)}rem;
    ${props => props.variant === 'contained' && 'font-weight: bold;'}
    height: 2rem;
    line-height: 1rem;
    margin: 1rem 0.25rem;
    text-transform: none;
    transition: background-color 0.25s ease-out;

    ${props =>
      props.variant === 'contained' &&
      `&:hover {
      background-color: #009fcd;
      filter: brightness(1.1);
    }`}
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-flow: column nowrap;
  height: min-content;
  overflow-y: auto;
`;

export const NewTaskDrawerInnerContainer = styled(Grid).attrs({
  container: true,
})``;

export const AutoSaveContainer = styled.div`
  height: ${props => (props.visible ? 1.5 : 0)}rem;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  top: 0;
  transition: height 0.25s ease-out;
  width: 100%;
`;

export const AutoSaveLabel = styled.div`
  align-items: center;
  background-color: #d9036b;
  border-radius: 0 0 0.5rem 0.5rem;
  color: #fff;
  display: flex;
  height: 1.5rem;
  left: 50%;
  padding: 0 0.75rem;
  pointer-events: none;
  position: absolute;
  top: ${props => (props.visible ? 0 : -1.5)}rem;
  transition: top 0.25s ease-out;
  transform: translateX(-50%);
`;

export const StyledVerticalDivider = styled.div`
  background-color: #acb6c4;
  height: 2rem;
  width: 0.0625rem;
`;

export const BottomButtonContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  width: 100%;
`;

export const SideClickListener = styled.div`
  flex: 1;
`;
