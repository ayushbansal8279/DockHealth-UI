import styled from 'styled-components';

export const ListTourWrapper = styled.div`
  position: fixed;
  top: 150px;
  left: 50%;
  z-index: 201;
  transform: translateX(-50%);
`;

export const ListTourBackground = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
`;

export default ListTourWrapper;
