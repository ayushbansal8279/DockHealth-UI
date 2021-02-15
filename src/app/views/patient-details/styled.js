import styled from 'styled-components';
import spacing from 'styles/spacing';

export const PatientListsContainer = styled.div`
  margin: ${spacing.large} ${spacing.huge};
`;

export const BulkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${spacing.smallPlus};
`;

export default { PatientListsContainer };
