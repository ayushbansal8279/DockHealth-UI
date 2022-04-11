import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const HotkeysPopover = styled.div`
  width: 230px;
  display: none;
  position: absolute;
  bottom: 100%;
  left: 10px;
  cursor: initial;
  z-index: 1000;
`;

export const PopoverTitle = styled.p`
  margin-bottom: 0;
  font-size: inherit;
  font-weight: ${fontWeights.bold};
  text-transform: uppercase;
`;

export const HotkeysContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  color: ${palette.coolGrey2};
  cursor: help;

  &:hover ${HotkeysPopover} {
    display: block;
  }
`;

export const HotkeysText = styled.p`
  margin-left: 4px;
  margin-bottom: 0;
  font-size: inherit;
  cursor: inherit;
`;

export const HotkeysElements = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  align-items: center;
`;

export const HotkeyDescription = styled.p`
  display: inline-block;
  margin-bottom: 0;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.regular};
`;

export const Hotkey = styled.p`
  display: inline-block;
  margin-bottom: 0;
  padding: 0 4px;
  color: ${palette.white};
  background: ${palette.mediumGrey};
  border-radius: 4px;
`;
