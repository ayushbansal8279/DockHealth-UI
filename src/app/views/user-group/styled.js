import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const ListLoaderContainer = styled.div`
  margin: ${spacing.small} 0;
`;

export const ManageUsersContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  width: 100%;
  border: 1px solid ${palette.blueOcean};
  padding: 0.5rem 1rem 0.5rem 1rem;
  background-color: ${palette.white};
  max-width: 1179px;
`;

export const HeaderMessageContainer = styled.div`
  display: flex;
`;

export const HeaderMessage = styled.div`
  align-items: left;
  padding-left: 0.5rem;
`;

export const HeaderMessageTitle = styled.h2`
  margin-bottom: ${spacing.small};
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.bold};
  font-family: 'Montserrat', sans-serif;
`;

export const HeaderMessageDescription = styled.p`
  display: block;
  margin-bottom: 0;
  font-size: ${fontSizes.smallPLus};
  font-weight: ${fontWeights.extraLight};
  font-family: 'Montserrat', sans-serif;
`;

export const SearchInputWrapper = styled.div`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '300px')};
  transition: all 0.25s ease-in-out;
`;
