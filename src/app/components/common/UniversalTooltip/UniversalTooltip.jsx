import { Fade } from '@material-ui/core';
import React from 'react';
import {
  ArrowElement,
  ArrowElementReverse,
  ArrowElementReverseRight,
  ArrowElementRight,
  InnerTooltipContainer,
  StyledPopper,
  TooltipContainer,
  TooltipContainerReverse,
} from './styled';

const UniversalTooltip = ({ children, endSpacing, ...props }) => {
  if (props?.placement === 'top') {
    return (
      <StyledPopper {...props} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <TooltipContainerReverse>
              <InnerTooltipContainer>{children}</InnerTooltipContainer>
              <ArrowElementReverse />
            </TooltipContainerReverse>
          </Fade>
        )}
      </StyledPopper>
    );
  }

  if (props?.placement === 'top-end') {
    return (
      <StyledPopper {...props} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <TooltipContainerReverse>
              <InnerTooltipContainer>{children}</InnerTooltipContainer>
              <ArrowElementReverseRight />
            </TooltipContainerReverse>
          </Fade>
        )}
      </StyledPopper>
    );
  }

  if (props?.placement === 'bottom-end') {
    return (
      <StyledPopper {...props} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <TooltipContainer>
              <ArrowElementRight endSpacing={endSpacing} />
              <InnerTooltipContainer>{children}</InnerTooltipContainer>
            </TooltipContainer>
          </Fade>
        )}
      </StyledPopper>
    );
  }

  return (
    <StyledPopper {...props} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={250}>
          <TooltipContainer>
            <ArrowElement />
            <InnerTooltipContainer>{children}</InnerTooltipContainer>
          </TooltipContainer>
        </Fade>
      )}
    </StyledPopper>
  );
};

export default UniversalTooltip;
