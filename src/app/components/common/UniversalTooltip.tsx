import { Fade, Popper, PopperProps } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { MontserratTypography } from '../../theme-montserrat';

const TooltipContainer = styled.div`
  padding-top: 0.5rem;
  position: relative;
`;

const InnerTooltipContainer = styled.div`
  background-color: #3a4657;
  color: #fff;
  padding: 0.5rem;
  z-index: 2;
`;

const ArrowElement = styled.div`
  background-color: #3a4657;
  height: 1rem;
  position: absolute;
  left: 50%;
  top: 0.5rem;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 1rem;
  z-index: 1;
`;

const StyledPopper = styled(Popper)`
  && {
    z-index: 10000;
  }
`;

const UniversalTooltip = ({ children, ...props }: PopperProps) => {
  return (
    <StyledPopper {...props} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={250}>
          <TooltipContainer>
            <ArrowElement />
            <InnerTooltipContainer>
              <MontserratTypography weight="normal">
                {children}
              </MontserratTypography>
            </InnerTooltipContainer>
          </TooltipContainer>
        </Fade>
      )}
    </StyledPopper>
  );
};

export default UniversalTooltip;
