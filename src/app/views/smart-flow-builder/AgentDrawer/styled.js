import styled from 'styled-components';
import { Paper } from '@mui/material';

export const AnimatedContainer = styled(Paper)`
  position: fixed;
  top: 0;
  right: 0;
  width: 550px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e2e8f0;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  z-index: 1200;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
`;

export const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

export const DrawerTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

export const DrawerContent = styled.div`
  padding: 20px;
  height: calc(100vh - 80px);
  overflow-y: auto;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: #64748b;
  
  &:hover {
    background: #e2e8f0;
    color: #475569;
  }
`;
