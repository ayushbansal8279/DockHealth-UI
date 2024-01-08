import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';

export const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 203px;
  margin-bottom: 28px;
  border: 1px solid ${palette.coolGrey2};
  border-radius: 14px;
  background: ${palette.white};
  vertical-align: top;
  font-family: inherit;
  color: ${palette.mediumGrey};

  &:not(:last-of-type) {
    margin-right: 28px;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid ${palette.coolGrey2};
  font-size: 80px;
`;

export const DetailsContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  min-height: 78px;
  padding: 8px 12px;
`;

export const FileNameText = styled.p`
  display: block;
  height: 40px;
  width: 100%;
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
  color: inherit;
`;

export const CreatedText = styled.p`
  margin: 0;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.regular};
  color: inherit;
`;

export const OptionsContainer = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  color: ${palette.coolGrey2};
`;
