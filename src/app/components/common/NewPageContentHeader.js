import styled from 'styled-components';
import palette from 'styles/palette';

const PageContentHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${palette.white};
  color: ${palette.coolGrey1};
`;

export default PageContentHeader;
