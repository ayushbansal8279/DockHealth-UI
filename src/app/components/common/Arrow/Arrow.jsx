import React from 'react';
import ArrowIcon from 'img/arrow.svg';
import ArrowSecondaryIcon from 'img/arrow-secondary.svg';
import ArrowTriangleIcon from 'img/arrow-triangle.svg';
import ArrowDefaultIcon from 'img/arrow-default.svg';

import { ArrowImg, ArrowImgContainer, ArrowContainer } from './styled';

const ARROW_CONFIG = {
  primary: {
    icon: ArrowIcon,
    defaultIcon: ArrowIcon,
    openDegree: 180,
    closeDegree: 0,
    transitionTime: 0.4,
  },
  secondary: {
    icon: ArrowSecondaryIcon,
    defaultIcon: ArrowDefaultIcon,
    openDegree: 180,
    closeDegree: 0,
    transitionTime: 0.4,
  },
  triangle: {
    icon: ArrowTriangleIcon,
    defaultIcon: ArrowTriangleIcon,
    openDegree: 0,
    closeDegree: -90,
    transitionTime: 0.3,
  },
};

const Arrow = ({
  showArrow = true,
  showDefaultArrow = false,
  arrowType = 'primary',
  arrowPlacement = 'right',
  isOpen,
  setOpen,
  paddingLeft,
  justifyContent,
  children,
  isDisabled,
}) => {
  const arrowConfig = ARROW_CONFIG[arrowType];
  let arrowImg = arrowConfig?.icon;

  if (showDefaultArrow) {
    arrowImg = arrowConfig?.defaultIcon;
  }

  return (
    <ArrowContainer
      paddingLeft={paddingLeft}
      justifyContent={justifyContent}
      isDisabled={isDisabled}
    >
      {showArrow && arrowPlacement === 'left' && (
        <ArrowImgContainer>
          <ArrowImg
            alt="arrow"
            isOpen={isOpen}
            openDegree={arrowConfig?.openDegree}
            closeDegree={arrowConfig?.closeDegree}
            transitionTime={arrowConfig?.transitionTime}
            onClick={() => setOpen(!isOpen)}
            src={arrowImg}
          />
        </ArrowImgContainer>
      )}
      {React.cloneElement(children, {
        onClick: isDisabled ? () => {} : () => setOpen(!isOpen),
      })}
      {showArrow && arrowPlacement === 'right' && (
        <ArrowImgContainer>
          <ArrowImg
            alt="arrow"
            isOpen={isOpen}
            openDegree={arrowConfig?.openDegree}
            closeDegree={arrowConfig?.closeDegree}
            transitionTime={arrowConfig?.transitionTime}
            onClick={() => setOpen(!isOpen)}
            src={arrowImg}
          />
        </ArrowImgContainer>
      )}
    </ArrowContainer>
  );
};

export default Arrow;
