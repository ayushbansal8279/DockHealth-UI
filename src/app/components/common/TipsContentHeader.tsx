import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useBoolean from '../../hooks/useBoolean';
import { MontserratTypography } from '../../theme-montserrat';

const HeaderContainer = styled.div`
  align-items: center;
  background-color: #c1ccda;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  position: relative;
  width: 100%;
`;

const HeaderTop = styled.div`
  align-items: center;
  color: #ffffff;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr auto;
  height: 2rem;
  width: 100%;
`;

const HeaderContent = styled.div`
  padding: 0.25rem 0;
  width: 100%;
`;

const HeaderBottom = styled.div`
  color: #ffffff;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  padding: 0 2rem;
  text-decoration: underline;
  width: 100%;
`;

const HeaderArrow = styled.div<{ left: number }>`
  background-color: #c1ccda;
  height: 1rem;
  left: ${props => props.left}px;
  position: absolute;
  top: 0;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 1rem;
`;

interface TipsContentHeaderProps {
  arrowAnchorElement?: HTMLElement;
  children?: React.ReactNode;
  closeHeader?: () => void;
  label?: React.ReactNode;
  onTakeTourClick?: () => void;
  showTakeTour?: boolean;
}

const TipsContentHeader = ({
  arrowAnchorElement,
  children,
  closeHeader,
  label,
  onTakeTourClick,
  showTakeTour = true,
}: TipsContentHeaderProps) => {
  const [isArrowShown, showArrow, hideArrow] = useBoolean(false);
  const [arrowPosition, setArrowPosition] = useState(0);

  useEffect(() => {
    if (arrowAnchorElement) {
      showArrow();
      const { width } = arrowAnchorElement?.getBoundingClientRect() || {};
      const x = arrowAnchorElement?.offsetLeft;

      if (width && x) {
        setArrowPosition(x + 0.5 * width);
      }
    } else {
      hideArrow();
    }
  }, [arrowAnchorElement, hideArrow, showArrow]);

  return (
    <HeaderContainer>
      {isArrowShown && <HeaderArrow left={arrowPosition} />}
      <HeaderTop>
        <div>{label}</div>
        <IconButton
          size="small"
          color="inherit"
          onClick={() => closeHeader?.()}
        >
          <Close />
        </IconButton>
      </HeaderTop>
      <HeaderContent>{children}</HeaderContent>
      {showTakeTour && onTakeTourClick && (
        <HeaderBottom onClick={onTakeTourClick}>
          <MontserratTypography weight="bold" variant="h4">
            Take the tour
          </MontserratTypography>
        </HeaderBottom>
      )}
    </HeaderContainer>
  );
};

export default TipsContentHeader;
