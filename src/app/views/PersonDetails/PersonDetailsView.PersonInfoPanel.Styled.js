import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const PersonImage = styled.img`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

export const InfoPanelContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: ${spacing.large} ${spacing.largePlus};
  font-size: ${fontSizes.regular};
  line-height: 1.2;
  font-weight: ${fontWeights.light};
`;

export const PersonTitle = styled.p`
  display: block;
  margin-bottom: 0;
  padding-left: ${spacing.regular};
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.black};
  text-transform: uppercase;
`;

export const ContactInfoContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 ${spacing.huge};
  color: ${palette.mediumGrey};
`;

export const ContactInfoItem = styled.p`
  margin-bottom: 0;

  &:not(:first-child) {
    padding-left: ${spacing.huge};
  }

  &:not(:last-child) {
    position: relative;
    padding-right: ${spacing.huge};
    &:after {
      position: absolute;
      top: 0;
      right: -2px;
      display: block;
      content: '|';
    }
  }
`;

export const ArchivePersonButton = styled.button`
  flex-shrink: 0;
  color: ${palette.lighterCyanBlue};
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    filter: brightness(1.25);
  }
`;
