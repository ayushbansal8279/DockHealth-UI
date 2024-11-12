import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import prop from 'ramda/src/prop';

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${palette.coolGrey3};
`;

export const StatusListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: auto;
  font-family: inherit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.mediumGrey};
  padding-top: ${spacing.small};
  padding-right: ${spacing.largePlus};
`;

export const StatusList = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(10, 38px);
  grid-template-columns: repeat(
    ${({ elementsCount }) => {
      if (elementsCount < 11) {
        return '1';
      }

      if (elementsCount < 21) {
        return '2';
      }

      if (elementsCount < 31) {
        return '3';
      }

      if (elementsCount < 41) {
        return '4';
      }

      if (elementsCount < 51) {
        return '5';
      }

      if (elementsCount < 61) {
        return '6';
      }

      return `${Math.floor(elementsCount / 10)}`;
    }},
    1fr
  );
  width: ${({ elementsCount }) => {
    if (elementsCount < 11) {
      return 140;
    }

    if (elementsCount < 21) {
      return 280;
    }

    return 550;
  }}px;
  max-height: ${10 * 32}px;
  margin: ${spacing.small} 0;
`;

export const NewStatusButtonWrapper = styled.div`
  width: 7rem;
  padding: ${spacing.tiny} ${spacing.smallPlus} ${spacing.tiny} ${spacing.regular};
`;

export const NewStatusButton = styled.button`
  height: 24px;
  width: 100%;
  border: 1px solid ${palette.coolGrey2};
  color: ${palette.coolGrey2};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  text-align: center;
  line-height: 22px;
  cursor: pointer;
`;

export const ColorPickerWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  gap: 8px;
  width: 280px;
  padding: ${spacing.small} ${spacing.regular};
  margin: 0 auto;
`;

export const ColorButton = styled.button`
  display: block;
  background-color: ${prop('color')};
  width: 24px;
  height: 24px;
  border-radius: 12px;

  ${({ selected }) =>
    selected &&
    `
    border: 1px solid ${palette.white};
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
  `}
`;

export const ColorPickerContainer = styled.div`
  border-top: 1px solid ${palette.coolGrey2};
  display: flex;
  width: 100%;
  margin-top: 55px;
`;