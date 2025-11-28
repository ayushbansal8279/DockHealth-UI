import { Paper } from '@mui/material';
import styled from 'styled-components';

export const ConfigPanel = styled(Paper)`
  width: 550px;
  height: 100%;
  background: white;
  border-left: 1px solid #e2e8f0;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  margin-right: 68px;
`;

export const ConfigSubPanel = styled.div`
  padding: 0 16px;
`;

export const ConfigHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px;
  border-bottom: 1px solid #e2e8f0;
`;

export const ConfigTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ConfigActions = styled.div`
  display: flex;
  gap: 4px;
`;

export const ConfigSection = styled.div`
  margin-bottom: 20px;
`;



export const ConfigButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 50px;
`;