import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

// eslint-disable-next-line import/prefer-default-export
export const NonEmptyListTable = styled.div`
  color: ${palette.unknownGrey1};
  margin: 0.2rem;
  ${props => props.highlightedPatientIdentifier && 'margin-right: 0.25rem;'}
`;

export const ListLoaderContainer = styled.div`
  width: 915px;
  margin: ${spacing.giga} auto;
`;
