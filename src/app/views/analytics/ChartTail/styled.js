import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const Container = styled.div`
  flex: 1 1 auto;
  padding: 24px 48px;
  background: ${palette.white};
  border-radius: 8px;
  border-top: 8px solid ${palette.black};
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
  overflow: hidden;
  position: ${({ maximized }) => (maximized ? 'absolute' : 'relative')};
  width: ${({ maximized }) => (maximized ? '100%' : 'calc(50% - 24px)')};
  height: ${({ maximized }) => (maximized ? '100%' : '420px')};
  z-index: ${({ maximized }) => (maximized ? '999' : '0')};

  @media (max-width: 1280px) {
    width: 100%;
  }
`;

export const Title = styled.p`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.bold};
  color: ${palette.black};
`;
