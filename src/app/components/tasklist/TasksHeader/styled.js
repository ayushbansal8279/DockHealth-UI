import styled from 'styled-components';
import palette from 'styles/palette';

export const BulkContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 54px;
  margin-left: 13px;
  &::after {
    border-right: 1px solid ${palette.coolGrey3};
    content: '';
    position: absolute;
    top: 0px;
    left: calc(100% - 1px);
    width: 0px;
    height: 36px;
  }
`;

export const StickyColumnContainer = styled.div`
  ${({ customWidthExists }) =>
    customWidthExists
      ? ''
      : `
    flex: 1;
  min-width: 500px;
  `}
  position: sticky;
  display: flex;
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

    @media print {
      border-left: 1px solid ${palette.coolGrey1};
    }
  }

  &::after {
    content: '';
    display: block;
    background: ${palette.white};
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100%;
    width: 100%;
    z-index: -1;
    // box-shadow: -1px 0 3px 0 rgba(0, 0, 0, 0), 2.5px 0 0 0 #48bbb3;
  }

  @media print {
    border-top: 1px solid ${palette.coolGrey1};
    border-bottom: 1px solid ${palette.coolGrey1};
    border-left: 1px solid ${palette.coolGrey1} !important;
    width: 300px;
    min-width: 200px;
    max-width: 300px;
  }
`;
