import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import Button from 'components/common/Button/Button';

export const EmptyListContainer = styled.div`
  padding: 2rem;
  text-align: center;
  flex: 1;
`;

export const EmptyListHeader = styled.div`
  position: absolute;
  width: 441px;
  hegiht: 82px;
  left: 106px;
  top: 162px;

  font-family: Montserrat;
  font-size: ${fontSizes.large};
  line-height: 153%;
  text-align: left;
`;

export const EmptyListContent = styled.div`
  position: absolute;
  width: 513px;
  height: 42px;
  left: 106px;
  top: 264px;

  font-family: Montserrat;
  font-size: ${fontSizes.regular};
  line-height: 130%;
  text-align: left;
`;

export const StyledButton = styled(Button)`
  margin-right: 20px;
  width: 265px;
  height: 50px;
`;
export const ImportAnimals = styled.img`
  position: absolute;
  width: 423px;
  height: 181.57px;
  left: 660px;
  top: 180.8px;
`;

export const DownloadIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 7px;
`;

export const DownloadTemplate = styled.a`
  font-family: 'Roboto Condensed', sans-serif;;
  font-style: normal;
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.regular};
  line-height: 19px;
`;
