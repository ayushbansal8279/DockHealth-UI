import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import MuiCheckIcon from '@mui/icons-material/Check';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 22px;
  width: 100%;
  padding: 18px;
  border-radius: 10px;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
  font-family: 'Roboto Condensed', sans-serif;
  background-color: ${palette.white};
`;

export const Name = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.largePlus};
  font-weight: ${fontWeights.bold};
  color: ${palette.midnightBlue};
  line-height: 1.2;
`;

export const Description = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: ${palette.midnightBlue};
`;

export const Price = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.largePlus};
  font-weight: ${fontWeights.bold};
  color: ${palette.midnightBlue};
  line-height: 1.2;
`;

export const Units = styled.span`
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.regular};
  color: ${palette.coolGrey2};
`;

export const PurchaseButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  border-radius: 16px;
  background-color: ${({ active, color }) => (active ? 'transparent' : color)};
  border: 2px solid ${({ color }) => color};
  color: ${({ active, color }) => (active ? color : palette.white)};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  ${({ active }) => (active ? '' : 'text-transform: uppercase;')}
`;

export const CheckIcon = styled(MuiCheckIcon)`
  &&& {
    .MuiCheckIcon-root {
      position: absolute;
      left: -30px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`;

export const Level = styled.p`
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.bold};
  color: ${palette.midnightBlue};
  line-height: 1.2;
`;
