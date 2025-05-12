import styled from 'styled-components';

export const MeteringStatsPanelsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  width: 50%;
`;

export const StatsPanel = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 22%;
  text-align: center;
  .stats-label {
    font-size: 14px;
    color: #666;
  }
`;

export const ClickableValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  cursor: pointer;
  &:hover {
    color: #007bff;
    text-decoration: underline;
  }
`;
