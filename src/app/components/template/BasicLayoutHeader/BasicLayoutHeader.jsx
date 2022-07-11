import React from 'react';
import LayoutHeader from '../LayoutHeader/LayoutHeader';

const BasicLayoutHeader = props => {
  const { title, description, isChat } = props;
  return (
    <LayoutHeader isChat={isChat}>
      <LayoutHeader.Title title={title} description={description} />
    </LayoutHeader>
  );
};

export default BasicLayoutHeader;
