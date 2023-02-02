import React from 'react';
import { Container } from './styled';

const ViewLayout = (props) => {
  const { header, children } = props;
  return (
    <>
      {header}
      <Container>{children}</Container>
    </>
  );
};

export default ViewLayout;
