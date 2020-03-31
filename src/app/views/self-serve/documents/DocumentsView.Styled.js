import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import palette from '../../../palette';

export const H1 = styled.h1`
  font-size: 2.25rem;
  margin: 0.25rem 0;
`;

export const H2 = styled.h2`
  font-size: 1.75rem;
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

export const DocumentsViewContainer = styled(Grid)`
  && {
    background-color: ${palette.white};
    left: 0;
    min-height: 100%;
    padding: 2.625rem 4.625rem;
    position: absolute;
    top: 0;
    width: 100%;
  }
`;

export const DocumentContainer = styled(Grid)`
  && {
    margin-bottom: 8rem;
  }
`;

export const DocumentDescription = styled(H3)`
  color: ${palette.error};
`;

export const DocumentLink = styled.a`
  color: ${palette.brightBlue};
  filter: brightness(1);
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.cyanBlue};
    filter: brightness(1.35);
  }
`;

export const DocumentImage = styled.img`
  cursor: default;
`;
