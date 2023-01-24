import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

// eslint-disable-next-line import/prefer-default-export
export const FilterOptionWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  background-color: ${({ selected }) =>
    selected ? palette.darkBlue : palette.blueGrey};
  color: ${({ selected, disabled }) => {
    if (selected) {
      return 'white';
    }
    if (disabled) {
      return palette.coolGrey2;
    }

    return 'black';
  }};
  border-radius: 4px;
  font-size: ${fontSizes.small};
  padding: 0 8px;
  overflow: hidden;

  &:not(:last-of-type) {
    margin-bottom: 4px;
  }

  ${(props) =>
    !props.disabled &&
    `
      cursor: pointer;
    `}

  ${({ selected, disabled }) =>
    !selected &&
    !disabled &&
    `&:hover {
      background-color: ${palette.coolGrey2};
      color: white;}`};

  ${({ color }) => color && `border-left: 8px solid ${color};`}
`;

export const OptionLabel = styled.span`
  flex: 1 0 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const OptionCount = styled.div`
  margin-left: 8px;
  color: ${palette.coolGrey1};
`;

export const StartAdornmentWrapper = styled.div`
  flex: auto 0 0;
  margin-right: 8px;
`;
