import styled from 'styled-components';
import { typography } from 'styles/palette';

// eslint-disable-next-line import/prefer-default-export
export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 884px;
  max-height: 530px;
  padding: 24px 24px 8px;
  font-family: ${typography.text};
  overflow: hidden;
`;
