import React from 'react';
import LayoutHeader from '../LayoutHeader/LayoutHeader';

const BasicLayoutHeader = props => {
  const { title, description } = props;
  return (
    <LayoutHeader>
      <LayoutHeader.Title title={title} description={description} />
    </LayoutHeader>
  );
};

export default BasicLayoutHeader;
