/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { useUnmount } from 'react-use';
import styled from 'styled-components';
import { useBoolean } from 'hooks/useBoolean';
import TipsDotsBackground from 'img/tips-dots-background.svg';
import palette from 'styles/palette';

const HeaderContainer = styled.div`
  align-items: center;
  background: url(${TipsDotsBackground}),
    linear-gradient(to right, ${palette.brightBlue}, ${palette.darkBlue});
  background-repeat: repeat-x;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  left: 1.25rem;
  margin-right: 1.25rem;
  padding: 0.5rem 1rem;
  position: absolute;
  width: auto;
  z-index: 100;
`;

const HeaderContent = styled.div`
  padding: 0.25rem 0;
  width: 100%;
`;

export const HeaderBottom = styled.div`
  color: #ffffff;
  padding: 0 2rem;
  width: 100%;
`;

const HeaderArrow = styled.div<{ left: number }>`
  background-color: transparent;
  border: 1rem solid transparent;
  border-bottom-color: #00a2e5;
  height: 0;
  left: ${(props) => props.left}px;
  position: absolute;
  top: 0;
  transform: translate(-100%, -100%) scaleY(0.8);
  transform-origin: bottom;
  width: 0;
`;

interface TipsPopoverProps {
  arrowAnchorElement?: HTMLElement;
  children?: React.ReactNode;
  closeHeader?: () => void;
  label?: React.ReactNode;
  onTakeTourClick?: () => void;
  showTakeTour?: boolean;
  footerContent?: React.ReactNode;
}

const createMutationObserver = (callback: () => void) =>
  new MutationObserver(callback);

const LIGHTBULB_CENTER_POSITION = 11;

const TipsPopover = ({
  arrowAnchorElement,
  children,
  footerContent,
}: TipsPopoverProps) => {
  const [isArrowShown, showArrow, hideArrow] = useBoolean(false);
  const [arrowPosition, setArrowPosition] = useState(0);

  const [observer, setObserver] = useState<MutationObserver | null>(null);

  const resetArrowPosition = useCallback(() => {
    if (arrowAnchorElement) {
      showArrow();
      const offsetLeft = arrowAnchorElement?.offsetLeft;

      if (offsetLeft) {
        setArrowPosition(offsetLeft + LIGHTBULB_CENTER_POSITION);
      }
    } else {
      hideArrow();
    }
  }, [arrowAnchorElement, hideArrow, showArrow]);

  useEffect(() => {
    const toolbarLeftContainer = document.querySelector(
      '#toolbar-left-container',
    );

    if (toolbarLeftContainer) {
      // eslint-disable-next-line no-unused-expressions
      observer?.disconnect?.();

      const newObserver = createMutationObserver(() => {
        // using standard transition duration
        setTimeout(() => resetArrowPosition(), 250);
      });
      newObserver.observe(toolbarLeftContainer, {
        attributes: true,
        subtree: true,
      });

      setObserver(newObserver);
    }

    resetArrowPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrowAnchorElement, resetArrowPosition]);

  useUnmount(() => {
    // eslint-disable-next-line no-unused-expressions
    observer?.disconnect?.();
  });

  return (
    <HeaderContainer>
      {isArrowShown && <HeaderArrow left={arrowPosition} />}
      <HeaderContent>{children}</HeaderContent>
      {footerContent && <HeaderBottom>{footerContent}</HeaderBottom>}
    </HeaderContainer>
  );
};

export default TipsPopover;
