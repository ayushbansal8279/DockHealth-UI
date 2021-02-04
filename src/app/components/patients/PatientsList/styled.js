import styled from 'styled-components';
import palette from 'styles/palette';

// eslint-disable-next-line import/prefer-default-export
export const NonEmptyListTable = styled.div`
  color: ${palette.unknownGrey1};
  margin: 2rem;
  ${props => props.highlightedPatientIdentifier && 'margin-right: 0.25rem;'}
`;
