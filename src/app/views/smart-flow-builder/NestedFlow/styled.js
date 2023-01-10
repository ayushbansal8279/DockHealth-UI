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
  padding: 0 20px;
  max-width: 280px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export default NestedFlowNodeStyled;
