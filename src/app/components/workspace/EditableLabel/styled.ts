import styled from 'styled-components';
import palette from '@/app/styles/palette';
import { IconButton } from '@mui/material';

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  &:hover button {
    display: inline-flex;
  }

  button {
    display: none;
    margin-left: 8px;
    align-self: center;
  }
`;

export const EditableInput = styled.input<{ width?: string }>`
  background-color: transparent;
  border: 1px solid #d4d9df;
  color: ${palette.mediumGrey};
  font-size: 14px;
  height: 20px;
  width: ${({ width }) => width || '250px'};
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:focus {
    outline: none;
    border: 1px solid ${palette.coolGrey2};
  }
`;

export const LabelText = styled.div<{ width?: string }>`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: ${({ width }) => width || '250px'};
  font-size: 14px;
  color: ${palette.mediumGrey};
  height: 20px;
  line-height: 20px;
`;

export const StyledEditButton = styled(IconButton)`
  padding: 4px;
`;