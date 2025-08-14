import { fontWeights } from '@/app/styles/font';
import styled from 'styled-components';
import palette from 'styles/palette';

const NestedFlowNodeStyled = styled.div`
  width: 100%;
  height: 90px;
  padding: 0 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${palette.brightBlue};
  color: ${palette.white};
`;

export const TaskWrapper = styled.div`
  color: ${palette.white};
  background-color: ${palette.cyanBlue};
  border-radius: 4px;
  max-width: 280px;
`;

export const TaskLinks = styled.div`
  width: 100%;
  margin-top: 5px;
  padding: 0px 25px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DescriptionAndLinksWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  width: 100%;
`;

export const WorkflowDescription = styled.div`
  margin: 5px;
  padding: 0px 18px;
  font-size: 16px;
  font-weight: ${fontWeights.bold};
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NewWorkflowDescription = styled.div`
  margin: 5px;
  padding: 0px 18px;
  font-size: 16px;
  font-weight: ${fontWeights.regular};
  color: ${palette.coolGrey2};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NewNestedFlowNodeWrapper = styled.div`
  width: 100%;
  padding: 12px 0 12px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  color: ${palette.coolGrey2};
  background: transparent;
`;

export default NestedFlowNodeStyled;
