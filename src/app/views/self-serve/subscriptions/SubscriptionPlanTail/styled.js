import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import MuiCheckIcon from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';

export const Container = styled.div`
  width: 279px;
  padding: 60px 18px 18px;
  border-radius: 10px;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
  border-top: 10px solid ${({ color }) => color};
  font-family: 'Roboto', sans-serif;
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
  position: relative;
  width: 100%;
  margin-bottom: 50px;
`;

export const Name = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.largePlus};
  font-weight: ${fontWeights.bold};
  color: ${({ color }) => color};
`;

export const Description = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: ${palette.black};
  min-height: 126px;
`;

export const PriceContainer = styled.div`
  display: flex;
  height: 54px;
  width: 100%;
  margin-bottom: 24px;
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
  border-radius: 16px;
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
  border-radius: 16px;
  background-color: ${({ active, color }) => (active ? 'transparent' : color)};
  border: 2px solid ${({ color }) => color};
  color: ${({ active, color }) => (active ? color : palette.white)};
  font-size: ${fontSizes.smallPlus};
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
  margin: 30px 0;
  border: 1px solid ${palette.coolGrey3};
`;

export const FeatureText = styled.p`
  position: relative;
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
`;

export const CheckIcon = withStyles({
  root: {
    position: 'absolute',
    left: -30,
    top: '50%',
    transform: 'translateY(-50%)',
  },
})(MuiCheckIcon);
