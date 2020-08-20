import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const FormWrapper = styled.form`
  font-family: 'Montserrat', sans-serif;
  color: ${palette.mediumGrey};
`;

export const Title = styled.h2`
  margin-bottom: 0;
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
  text-transform: uppercase;
`;

export const Description = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.light};
  font-family: inherit;
`;

export const BottomSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ButtonWrapper = styled.div`
  width: 265px;
`;

export const TileSettingsHeader = styled.h3`
  margin-bottom: 0;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.light};
  font-family: inherit;
`;

export const TileSettingsDescription = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.light};
  font-family: inherit;
  color: ${palette.lightGrey};
`;

export const ColorPickerHeader = styled.h4`
  margin-bottom: 0;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.light};
  font-family: inherit;
  color: ${palette.lightGrey};
`;

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

export const InitialsError = styled.p`
  margin-bottom: 0;
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.small};
`;
