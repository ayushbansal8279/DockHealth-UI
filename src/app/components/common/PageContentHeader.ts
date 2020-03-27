import styled from 'styled-components';

const PageContentHeader = styled.div<{ paneled?: boolean }>`
  align-items: center;
  background-color: #fff;
  color: #8492a4;
  ${props =>
    props.paneled
      ? 'border: 0.125rem solid #ddf2f7; margin-bottom: 1.5rem;'
      : 'border-bottom: 0.0625rem solid #e5e9f2;'}
  display: flex;
  height: 5.75rem;
  min-height: 5.75rem;
  justify-content: space-between;
  padding: 0 2rem;
  width: 100%;
`;

export default PageContentHeader;
