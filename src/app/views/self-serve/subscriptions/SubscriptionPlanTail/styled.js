import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import MuiCheckIcon from '@mui/icons-material/Check';

const containerBorderStyle = (active, pro) => {
  if (active) {
    return `${palette.newBrightBlue} 2px`;
  }
  if (pro) {
    return `${palette.newBrightBlue} 2px`;
  }
  return `${palette.coolGrey3} 1px`;
};

export const Container = styled.div`
  width: 260px;
  padding: 18px 18px;
  border-radius: 10px;
  border-top: 10px solid ${({ color }) => color};
  border: ${({ active, pro }) => `solid ${containerBorderStyle(active, pro)}`};
  font-family: inherit;
`;

export const MostPopularTextWrapper = styled.div`
  padding: 6px;
  border-radius: 15px;
  overflow: hidden;
  background-color: rgba(90, 113, 242, 0.1);
`;

export const MostPopularText = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.light};
  color: ${palette.black};
`;

export const NewText = styled.p`
  position: absolute;
  top: -20px;
  left: 0;
  margin-bottom;
  color: ${palette.red};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
`;

export const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
`;

export const Name = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  color: ${palette.black};
`;

export const Description = styled.p`
  margin-top: 5px;
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey8};
  min-height: 80px;
`;

export const PlanDescriptionContainer = styled.div`
  height: 60px;
  margin-bottom: 24px;
`;

export const PlanDescription = styled.p`
  margin-bottom: 0px;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey8};
`;

export const PriceContainer = styled.div`
  display: flex;
  height: 54px;
  width: 100%;
`;

export const Price = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.huge};
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

const buttonBackgroundColor = (active, pro) => {
  if (active) return 'transparent';
  if (pro) return palette.newBrightBlue;
  return palette.newDarkBlue;
};

export const SubscribeButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  background-color: ${({ active, pro }) => buttonBackgroundColor(active, pro)};
  border: 2px solid ${({ active }) => (active ? palette.newBrightBlue : '')};
  color: ${({ active }) => (active ? palette.newBrightBlue : palette.white)};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ContactUsAnchor = styled.a`
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  background-color: ${({ active, color }) => (active ? 'transparent' : color)};
  border: 2px solid ${({ color }) => color};
  color: ${({ active, color }) => (active ? color : palette.white)};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  text-transform: uppercase;
  text-align: center;
  line-height: 1.2;

  &:hover {
    color: ${palette.white};
  }
`;

export const Divider = styled.hr`
  width: 100%;
  margin: 20px 0;
`;

export const FeatureText = styled.p`
  position: relative;
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: 600;
  margin-top: 20px;
`;

export const DisclaimerText = styled.p`
  margin-bottom: 0;
  font-size: 12px;
  font-weight: 400;
  color: ${palette.coolGrey10};
`;

export const SupportText = styled.p`
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 400;
  color: ${palette.coolGrey10};
`;

export const CheckIcon = styled(MuiCheckIcon)`
  &&& {
    &.MuiCheckIcon-root {
      position: absolute;
      left: -30px;
      top: 50%;
      transform: translateY(-50%);
    }
    height: 16px;
  }
`;
