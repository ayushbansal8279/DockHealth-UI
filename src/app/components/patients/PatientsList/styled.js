import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { GridActionsCellItem } from '@mui/x-data-grid-premium';

// eslint-disable-next-line import/prefer-default-export
export const NonEmptyListTable = styled.div`
  color: ${palette.unknownGrey1};
  margin: 0.2rem;
  ${(props) =>
    props.highlightedPatientIdentifier ? 'margin-right: 0.25rem;' : ''}
`;

export const ListLoaderContainer = styled.div`
  width: 915px;
  margin: ${spacing.giga} auto;
`;

export const BulkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  left: 24px;
`;

export const Text = styled.span`
  width: ${(props) => (props.width ? `${props.width}px;` : '')}
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PatientCell = styled.span`
  cursor: pointer;
`;
