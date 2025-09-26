import styled from 'styled-components';

export const PatientCell = styled.span`
  cursor: pointer;
`;

export const Text = styled.span`
  font-family: inherit;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.43;
  color: ${({ theme }) => theme.palette?.text?.primary || '#000'};
  width: ${({ width }) => width || 'auto'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ViewContainer = styled.div`
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  padding: 0 24px;
  gap: 24px;
`;

export const TableWrapper = styled.div`
`;
