import styled from 'styled-components';

export const VListGroup = styled.div`
  display: block;
  font-weight: bold;
  text-transform: uppercase;
  line-height: ${({ enableTaskGroup }: any) =>
    enableTaskGroup ? '40px' : '10px'};
  height: ${({ enableTaskGroup }: any) => (enableTaskGroup ? '40px' : '10px')};
  margin-top: ${({ bgColor }: any) => (bgColor ? '23px' : '0px')};
`;
