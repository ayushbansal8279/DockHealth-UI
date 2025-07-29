import { Paper } from '@mui/material';
import styled from 'styled-components';

export const ConfigPanel = styled(Paper)`
  width: 750px;
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

export const ConfigLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

export const ConfigInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const ConfigTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const ConfigSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;
