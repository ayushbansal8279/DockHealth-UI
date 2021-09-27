import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

const INITIAL_AVATAR_SIZE = 110;
const getScaledSize = ({ normalSize, propSize }) =>
  Math.floor(
    (normalSize * (propSize ?? INITIAL_AVATAR_SIZE)) / INITIAL_AVATAR_SIZE,
  );

export const BackgroundContainer = styled.div`
  background-color: ${palette.white};
  border-radius: 50%;
`;

export const AvatarContainer = styled.div`
  align-items: center;
  border: 2px solid ${({ color }) => color};
  border: ${({ color, isSelected, size }) =>
    isSelected
      ? `${getScaledSize({
          normalSize: 6,
          propSize: size,
        }) + 2}px solid ${palette.cyanBlue}`
      : `2px solid ${color}`};
  border-radius: 50%;
  display: inline-flex;
  min-height: ${props => props.size ?? 110}px;
  min-width: ${props => props.size ?? 110}px;
  height: ${props => props.size ?? 110}px;
  padding: 0;
  justify-content: center;
  position: relative;
  width: ${props => props.size ?? 110}px;
  opacity: ${props => props.isBlurred && '0.5'};
  overflow: visible;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'inherit')};
`;

export const InnerAvatarContainer = styled.div`
  align-items: center;
  background-color: ${({ color }) => color};
  border: ${({ size, isSelected }) => {
    const scaledSize = getScaledSize({
      normalSize: 6,
      propSize: size,
    });
    return isSelected ? 'none' : `${scaledSize}px solid #ffffff`;
  }};

  border-radius: 50%;
  box-sizing: border-box;
  color: ${palette.white};
  display: flex;
  font-family: 'Montserrat', sans-serif;
  font-size: ${({ size }) =>
    getScaledSize({ normalSize: 40, propSize: size })}px;
  font-weight: bold;
  justify-content: center;
  line-height: 1;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  text-transform: lowercase;
  width: 100%;

  & > p {
    margin-bottom: 0;
  }
`;

export const AvatarImageContainer = styled.img`
  && {
    cursor: inherit;
    height: 100%;
    width: 100%;
  }
`;

export const OnlineIndicator = styled.div`
  background-color: #219653;
  border: 1px solid white;
  border-radius: 50%;
  height: 10px;
  width: 10px;
  left: 90%;
  position: absolute;
  top: 15%;
  transform: translate(-50%, -50%);
`;

export const OfflineIndicator = styled.div`
  background-color: white;
  border: 1px solid ${palette.coolGrey1};
  border-radius: 50%;
  height: 10px;
  width: 10px;
  left: 90%;
  position: absolute;
  top: 15%;
  transform: translate(-50%, -50%);
`;

export const IdleIndicator = styled.div`
  background-color: ${palette.blueOcean};
  border: 1px solid white;
  border-radius: 50%;
  height: 10px;
  width: 10px;
  left: 90%;
  position: absolute;
  top: 15%;
  transform: translate(-50%, -50%);
`;

export const TooltipName = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  font-family: 'Montserrat', sans-serif;
`;

export const MemberImage = styled.img`
  min-width: 100%;
  min-height: 100%;
`;
