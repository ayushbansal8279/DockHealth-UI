import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const QuickFilterTitleContainer = styled.div`
  display: flex;
  height: 32px;
  align-items: center;
`;

export const QuickFilterTitle = styled.div`
  color: ${({ selected }) =>
    selected ? palette.newBrightBlue : palette.coolGrey1};
  text-align: center;
  font-family: Outfit;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 11px;
`;

export const OptionMenuContainer = styled.div`
  visibility: hidden;
  margin-left: 8px;
`;

// eslint-disable-next-line import/prefer-default-export
export const CustomFilterOptionWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 4px;
  gap: 10px;
  padding: 2px 0 2px 8px;
  background-color: ${({ selected }) => {
    return selected ? '#E7EAFF' : palette.whiteSmoke;
  }};
  border-radius: 4px;
  font-size: ${fontSizes.small};
  cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};

  ${(props) =>
    !props.disabled &&
    `
      cursor: pointer;
    `}

  ${({ selected, disabled }) =>
    !selected &&
    !disabled &&
    `&:hover {
      background-color: ${palette.whiteSmoke};
      color: white;}`};

  &:hover {
    & ${OptionMenuContainer} {
      visibility: visible;
    }
  }
`;
