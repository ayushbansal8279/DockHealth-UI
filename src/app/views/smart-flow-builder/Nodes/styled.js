import styled from 'styled-components';
import { Handle } from '@xyflow/react';
import palette from '@/app/styles/palette';
import { NodeType } from '@/app/helpers/smart-flow-builder-helpers';

export const OptionsContainer = styled.div`
  opacity: 0;
  transition: opacity 0.3s linear;
  position: absolute;
  top: 0px;
  right: -50px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
`;

export const NodeContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  min-height: 115px;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    ${OptionsContainer} {
      opacity: 1;
    }
  }

  &.selected {
    border-color: ${palette.azureBlue};
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }
`;

export const GrowButton = styled.div`
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s ease, transform 0.3s ease;
  transition-delay: ${({ index }) => index * 0.18}s;

  ${NodeContainer}:hover & {
    opacity: 1;
    transform: scale(1);
  }
`;

export const EmailNodeContainer = styled.div`
  background: white;
  border: 2px solid ${palette.orangeJulius};
  border-radius: 12px;
  padding: 16px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  min-height: 115px;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &.selected {
    border-color: ${palette.azureBlue};
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }
`;

export const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const NodeIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: ${({ subType }) => {
    switch (subType) {
      case 'AUTOMATION':
        return `linear-gradient(45deg, ${palette.orangeJulius}, ${palette.orangeJulius})`;
      case 'AGENT':
        return `linear-gradient(45deg, ${palette.oPlusRed}, ${palette.oPlusRed})`;
      case 'DECISION':
        return `linear-gradient(45deg, ${palette.blueOcean}, ${palette.blueOcean})`;
      default:
        return `linear-gradient(45deg, ${palette.blueOcean}, ${palette.blueOcean})`;
    }
  }};
`;

export const NodeTitle = styled.div`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${palette.gunmetal};
`;

export const NodeDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${palette.coolGrey10};
  line-height: 1.4;
`;

export const CustomNodeHandle = styled(Handle)`
  &:hover {
    transform: scale(3.1);
  }
`;

export const MethodBadge = styled.span`
  padding: 2px 6px;
  background: ${({ method }) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return '#22c55e';
      case 'POST':
        return '#3b82f6';
      case 'PUT':
        return '#f59e0b';
      case 'DELETE':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }};
  color: white;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const AIAnalyzerBadge = styled.span`
  background: #f3f4f6;
  color: #8b5cf6;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  margin-top: 8px;
`;
