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
  padding: 0.25rem;
  position: relative;
  width: 100%;
`;

const HeaderTop = styled.div`
  color: #ffffff;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const HeaderContent = styled.div<{ gridColumns: number }>`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(${props => props.gridColumns}, 1fr);
  padding: 0.25rem 2rem;
  width: 100%;

  > * {
    background-color: #ffffff;
    cursor: default;
    justify-self: center;
    max-height: 5rem;
    object-fit: contain;
    width: 100%;
  }
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
  children?: Array<React.ReactNode>;
  closeHeader?: () => void;
}

const TipsContentHeader = ({
  arrowAnchorElement,
  children,
  closeHeader,
}: TipsContentHeaderProps) => {
  const gridColumns = Array.isArray(children) ? children.length : 1;

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
        <IconButton
          size="small"
          color="inherit"
          onClick={() => closeHeader?.()}
        >
          <Close />
        </IconButton>
      </HeaderTop>
      <HeaderContent gridColumns={gridColumns}>{children}</HeaderContent>
      <HeaderBottom>
        <MontserratTypography weight="bold" variant="h5">
          Take the tour
        </MontserratTypography>
      </HeaderBottom>
    </HeaderContainer>
  );
};

export default TipsContentHeader;
