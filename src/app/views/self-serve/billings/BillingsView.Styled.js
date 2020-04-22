import { Collapse } from '@material-ui/core';
import styled from 'styled-components';
import palette from 'app/palette';

export const H1 = styled.h1`
  font-size: 2.25rem;
  margin: 0.25rem 0;
`;

export const H2 = styled.h2`
  font-size: 1.5rem;
  margin: 0.2rem 0;
`;

export const H3 = styled.h3`
  font-size: 1rem;
  margin: 0.15rem 0;
`;

export const H4 = styled.h4`
  font-size: 0.875rem;
  margin: 0.1rem 0;
`;

export const H5 = styled.h5`
  font-size: 0.75rem;
  margin: 0.05rem 0;
`;

export const Title = styled(H1)`
  color: ${palette.white};
  padding-left: 2rem;
`;

export const BillingsViewContainer = styled.div`
  background-color: ${palette.white};
  display: flex;
  justify-content: center;
  min-height: 100%;
  padding: 2.625rem 4.625rem;
  width: 100%;
`;

export const BillingsViewInnerContainer = styled.div`
  max-width: 60rem;
  width: 100%;
`;

export const StyledCollapse = styled(Collapse)`
  width: 100%;
`;

export const ErrorContainer = styled.div`
  align-items: center;
  background-color: ${palette.oPlusRed};
  color: ${palette.white};
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;
`;
