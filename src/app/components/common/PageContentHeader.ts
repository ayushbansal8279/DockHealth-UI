import styled from 'styled-components';
import palette from 'styles/palette';

const PageContentHeader = styled.div<{ paneled?: boolean }>`
  align-items: center;
  background-color: ${palette.white};
  color: ${palette.coolGrey1};
  ${props =>
    props.paneled
      ? `border: 0.125rem solid ${palette.unknownGrey2}; margin-bottom: 1.5rem;`
      : `border-bottom: 0.0625rem solid ${palette.coolGrey3};`}
  display: flex;
  height: 5.75rem;
  min-height: 5.75rem;
  justify-content: space-between;
  padding: 0 2rem;
  width: 100%;
`;

export default PageContentHeader;
