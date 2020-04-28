import React, { useRef } from 'react';
import QuestionMark from 'img/question-mark';
import useBoolean from 'hooks/useBoolean';
import UniversalTooltip from '../UniversalTooltip';

const Tooltip = ({ description }) => {
  const imgReference = useRef(null);
  const [isTooltipOpen, showTooltip, hideTooltip] = useBoolean(false);

  return (
    <>
      <img
        src={QuestionMark}
        ref={imgReference}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        alt="tooltip"
      />
      <UniversalTooltip
        open={isTooltipOpen}
        placement="bottom"
        anchorEl={imgReference.current}
      >
        {description}
      </UniversalTooltip>
    </>
  );
};

export default Tooltip;
