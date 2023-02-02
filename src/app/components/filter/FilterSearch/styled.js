import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const FilterSearchContainer = styled.div`
  display: flex;
`;

export const FilterSearchInputContainer = styled.div`
  position: relative;
  display: flex;
  margin-left: 8px;
`;

export const FilterSearchInput = styled.input`
  font-size: ${fontSizes.small};
  width: 64px;
  padding: 4px 8px;
  color: ${palette.lightGrey};
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
  border: none;
  border-bottom: 1px solid transparent;

  &:focus {
    width: 320px;
    color: ${palette.darkGrey};
    border-color: ${palette.coolGrey2};
    outline: none;
  }
`;

export const FilterClearIcon = styled.img`
  position: absolute;
  top: 4px;
  right: 0;
  opacity: ${(props) => (props.isInputFocused ? '1' : '0')};
  cursor: ${(props) => (props.isInputFocused ? 'pointer' : 'default')};
`;
