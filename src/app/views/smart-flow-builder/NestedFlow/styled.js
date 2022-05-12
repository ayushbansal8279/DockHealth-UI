import styled from 'styled-components';
import palette from 'styles/palette';

const NestedFlowNodeStyled = styled.div`
  width: 100%;
  height: 60px;
  padding: 0 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${palette.brightBlue};
  color: ${palette.white};
`;

export default NestedFlowNodeStyled;
