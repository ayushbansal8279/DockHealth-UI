import styled from 'styled-components';
import palette, { opacify } from 'app/palette';

const INITIAL_AVATAR_SIZE = 110;
const getScaledSize = ({ normalSize, propSize }) =>
  Math.floor(
    (normalSize * (propSize ?? INITIAL_AVATAR_SIZE)) / INITIAL_AVATAR_SIZE,
  );

export const AvatarContainer = styled.div`
  align-items: center;
  background-color: ${palette.white};
  border: 2px solid ${props => props.color ?? palette.cyanBlue};
  border-radius: 50%;
  ${props =>
    props.withShadow &&
    `box-shadow: 0px 4px 4px ${opacify(palette.black, 0.25)}`};
  cursor: ${props => (props.withCursor ? 'pointer' : 'default')};
  display: inline-flex;
  min-height: ${props => props.size ?? 110}px;
  min-width: ${props => props.size ?? 110}px;
  height: ${props => props.size ?? 110}px;
  padding: ${({ padded, size }) =>
    padded ? getScaledSize({ normalSize: 6, propSize: size }) : 0}px;
  justify-content: center;
  position: relative;
  width: ${props => props.size ?? 110}px;
`;

export const InnerAvatarContainer = styled.div`
  align-items: center;
  background-color: ${props => props.color ?? palette.cyanBlue};
  border: ${props =>
    props.padded
      ? `${getScaledSize({
          normalSize: 6,
          propSize: props.size,
        })}px solid #ffffff`
      : 0};
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
`;

export const AvatarImageContainer = styled.img`
  && {
    cursor: inherit;
    height: 100%;
    width: 100%;
  }
`;

export const CameraContainer = styled.div`
  align-items: center;
  background-color: ${palette.white};
  border: 2px solid ${palette.cyanBlue};
  border-radius: 50%;
  display: flex;
  height: ${({ size }) => getScaledSize({ normalSize: 40, propSize: size })}px;
  justify-content: center;
  left: 90%;
  position: absolute;
  top: 15%;
  transform: translate(-50%, -50%);
  width: ${({ size }) => getScaledSize({ normalSize: 40, propSize: size })}px;
`;
