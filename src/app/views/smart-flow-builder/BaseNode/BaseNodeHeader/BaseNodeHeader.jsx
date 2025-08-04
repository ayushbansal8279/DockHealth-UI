import React from 'react';
import BaseNodeHeaderTitle from '../BaseNodeHeaderTitle/BaseNodeHeaderTitle';
import { GrowButton, NodeHeaderWrapper, OptionsContainer } from '../styled';
const BaseNodeHeader = (props) => {
  const { optionButtons, headerTitle, headerIcon } = props;
  return (
    <NodeHeaderWrapper>
      {headerIcon}
      <BaseNodeHeaderTitle headerTitle={headerTitle} />
      <OptionsContainer>
        {optionButtons?.map((optionButton, index) => (
          <GrowButton key={index} index={index}>
            {optionButton}
          </GrowButton>
        ))}
      </OptionsContainer>
    </NodeHeaderWrapper>
  );
};

export default BaseNodeHeader;
