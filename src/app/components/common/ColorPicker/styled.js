import styled from 'styled-components';
import palette from 'styles/palette';
import { Variants } from './ColorPicker';

export const ColorPickerLabel = styled.label`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: ${props => props.color};
  cursor: pointer;

  ${({ variant }) =>
    variant === Variants.CIRCLE
      ? `
          border-radius: 50%;
          width: 24px;
          height: 24px;
        `
      : ''}
`;

export const Wrapper = styled.div`
  ${({ variant, width }) =>
    variant === Variants.CIRCLE
      ? `
          padding-top: 5px;
          width: ${width || 280}px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        `
      : ''}

  input[type='radio'] {
    display: none;

    &:checked + ${ColorPickerLabel} {
      position: relative;

      ${({ variant }) =>
        variant === Variants.CIRCLE
          ? `
          border: 1px solid ${palette.white};
          box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
        `
          : ''}

      ${({ variant }) =>
        variant === Variants.STANDARD
          ? `
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
          `
          : ''}
    }

    & + ${ColorPickerLabel} {
      margin-right: 8px;
      margin-left: 0;
      ${({ variant }) =>
        variant === Variants.CIRCLE
          ? `
        margin-left: 5px;
        margin-right: 5px;
        margin-bottom: 5px;
        `
          : ''}
    }
  }
`;
