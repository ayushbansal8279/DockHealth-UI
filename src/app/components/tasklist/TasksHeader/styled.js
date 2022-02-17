/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

export const BulkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${spacing.smallPlus};
`;

export const StickyColumnContainer = styled.div`
  position: sticky;
  display: flex;
  width: 100%;
  min-width: 500px;
  left: 24px;
  z-index: 11;
  border-left: 1px solid ${palette.coolGrey3};

  &::before {
    content: '';
    display: block;
    background: ${({ backgroundColor }) =>
      backgroundColor || palette.coolGrey4};
    position: absolute;
    left: -101px;
    top: 50%;
    transform: translateY(-50%);
    width: 100px;
    height: calc(100% + 4px);
    z-index: -1;
  }

  &::after {
    content: '';
    display: block;
    background: ${palette.white};
    position: absolute;
    left: 0px;
    top: 0px;
    /* width: 100%; */
    height: 100%;
    width: calc(100% - 15px);

    z-index: -1;
  }
`;
