import React from 'react';
import SelectDestinationModal from './SelectDestinationModal';

const SelectTemplateBundleDestination = props => {
  return <SelectDestinationModal {...props} movingContentType="BUNDLE" />;
};

export default SelectTemplateBundleDestination;
