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
  padding: 12px 20px;
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
