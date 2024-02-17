import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import MuiCheckIcon from '@mui/icons-material/Check';

export const Container = styled.div`
  width: 100%;
  padding: 3rem;
  padding-top: 10px;
  padding-bottom: 1rem;
  border-radius: 0.25rem;
  border: 1.5px solid ${palette.newDarkBlue};
  box-shadow: 0 0.5rem 1.5rem -0.5rem rgba(0, 0, 0, 0.1);
  font-family: 'Outfit', sans-serif;
  margin-top: 10px;
`;

export const LeftContainer = styled.div`
  width: 100%;
  padding: 3rem;
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1.5rem -0.5rem rgba(0, 0, 0, 0.1);
  font-family: 'Outfit', sans-serif;
  margin-top: 10px;
  optimizeLegibility !important;
`;

export const MostPopularText = styled.p`
  position: absolute;
  top: -20px;
  left: 0;
  margin-bottom;
  color: ${palette.red};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
`;

export const TopContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 0px;
`;

export const Name = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.largePlus};
  font-weight: ${fontWeights.bold};
  color: ${({ color }) => color};
`;

export const Title = styled.h2`
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.bold};
  color: ${({ color }) => color};
  margin: 1rem 0;
`;

export const Description = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: ${palette.black};
`;

export const PriceContainer = styled.div`
  display: flex;
  height: 54px;
  width: 100%;
  margin-bottom: 0px;
`;

export const Price = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.hugePlus};
  font-weight: ${fontWeights.bold};
  color: ${({ color }) => color};
`;

export const UnitContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 4px;
  font-size: ${fontSizes.hugePlus};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey2};
`;

export const UnitText = styled.p`
  margin-bottom: 0;
  font-size: 14px;
  line-height: 14px;
`;

export const SubscribeButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 4px;
  background-color: ${({ active, color }) => (active ? 'transparent' : color)};
  border: 2px solid ${({ color }) => color};
  color: ${({ active, color }) => (active ? color : palette.white)};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  ${({ active }) => (!active ? 'text-transform: uppercase;' : '')}
`;

export const ContactUsAnchor = styled.a`
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding: 14px;
  border-radius: 4px;
  background-color: ${({ active, color }) => (active ? color : palette.white)};
  border: 2px solid ${({ color }) => color};
  color: ${({ active, color }) => (active ? 'transparent' : color)};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  text-transform: uppercase;
  text-align: center;
  line-height: 1.2;

  &:hover {
    color: ${palette.white};
    background-color: ${palette.newDarkBlue};
  }
`;

export const Divider = styled.hr`
  width: 100%;
  margin: 15px 0;
  border: 1px solid ${palette.coolGrey3};
`;

export const FeatureText = styled.p`
  position: relative;
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
`;

export const CheckIcon = styled(MuiCheckIcon)`
  &&& {
    &.MuiCheckIcon-root {
      position: absolute;
      left: -30px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`;
