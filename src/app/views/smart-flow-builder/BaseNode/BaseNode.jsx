import React from 'react';
import BaseNodeHeader from './BaseNodeHeader/BaseNodeHeader';
import BaseNodeContent from './BaseNodeContent/BaseNodeContent';
import BaseNodeFooter from './BaseNodeFooter/BaseNodeFooter';
import { BaseNodeWrapper } from './styled';

const BaseNode = (props) => {
  const {
    selected,
    type,
    subType,
    optionButtons,
    onDoubleClick,
    headerTitle,
    headerIcon,
    footerContent,
    content,
  } = props;

  return (
    <BaseNodeWrapper
      selected={selected}
      type={type}
      subType={subType}
      onDoubleClick={onDoubleClick}
    >
      <BaseNodeHeader
        optionButtons={optionButtons}
        headerTitle={headerTitle}
        headerIcon={headerIcon}
        subType={subType}
      />
      <BaseNodeContent content={content} />
      <BaseNodeFooter footerContent={footerContent} />
    </BaseNodeWrapper>
  );
};

export default BaseNode;
