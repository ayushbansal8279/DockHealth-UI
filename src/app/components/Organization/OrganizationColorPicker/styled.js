import styled from 'styled-components';
import palette from 'styles/palette';

export const ColorPickerLabel = styled.label`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: ${props => props.color};
  cursor: pointer;
`;

export const ColorPickerWrapper = styled.div`
  input[type='radio'] {
    display: none;

    &:checked + ${ColorPickerLabel} {
      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 4px;
        transform: translate(-50%, -70%) rotate(-45deg);
        border-bottom: 2px solid ${palette.white};
        border-left: 2px solid ${palette.white};
      }
    }

    & + ${ColorPickerLabel} {
      margin-right: 8px;
      margin-left: 0;
    }
  }
`;
