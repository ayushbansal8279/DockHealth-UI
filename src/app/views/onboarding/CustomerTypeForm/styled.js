import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const FormWrapper = styled.form`
  font-family: 'Outfit', sans-serif;
  color: ${palette.mediumGrey};
`;

export const Title = styled.h2`
  margin-bottom: 0;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
  text-transform: uppercase;
`;

export const UnderTitle = styled.span``;

export const Description = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.light};
  font-family: inherit;
`;

export const ButtonWrapper = styled.div`
  width: 265px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const InitialsError = styled.p`
  margin-bottom: 0;
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.small};
`;

export const PickerItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 4px;
  cursor: pointer;
  width: 300px;

  & > span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
