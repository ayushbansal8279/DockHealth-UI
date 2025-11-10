import React from 'react';

type Props = { height?: number };

const VListSpacer: React.FC<Props> = ({ height = 80 }) => (
  <div style={{ height }} aria-hidden="true" />
);

export default React.memo(VListSpacer);
