import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export const NewTaskDrawerContainer = styled.div`
  align-items: flex-start;
  box-sizing: border-box;
  display: flex;
  height: calc(100vh - 5.5rem);
  justify-content: flex-start;
  padding: 0 0.25rem;
  position: sticky;
  transition: all 0.25s ease-out;
  top: 6.25rem;
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
  height: 2px;
  position: relative;
  transition: background-color 0.25s ease-out;
  width: 100%;

  ${props => props.condensed && 'margin: 0 0.5rem;'}
`;

export const FormSection = styled(FormSectionNoBorder)`
  background-color: #fff;
  border: 2px solid #ddf2f7;
`;

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
  padding-right: 0.5rem;
`;

export const StyledButton = styled(Button)`
  && {
    ${props => props.variant === 'contained' && 'background-color: #007cab;'}
    box-shadow: none;
    color: ${props => (props.variant === 'contained' ? '#fff' : '#009fcd')};
    font-size: ${props => (props.variant === 'contained' ? 1 : 0.875)}rem;
    ${props => props.variant === 'contained' && 'font-weight: bold;'}
    margin: 1.5rem 0.25rem;
    text-transform: none;
  }
`;

export const StyledForm = styled.form`
  overflow-y: auto;
  margin-right -1rem;
  padding-right: 1rem;
`;

export const NewTaskDrawerInnerContainer = styled(Grid).attrs({
  container: true,
})`
  && {
    width: 30.25rem;
  }
`;

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
