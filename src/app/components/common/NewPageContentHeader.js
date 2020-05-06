import styled from 'styled-components';
import palette from 'styles/palette';

const PageContentHeader = styled.div`
  align-items: center;
  background-color: ${palette.white};
  color: ${palette.coolGrey1};
  display: flex;
  justify-content: space-between;
  padding-right: 2rem;
  width: 100%;
`;

export default PageContentHeader;
