import { motion } from 'framer-motion/dist/framer-motion';
import styled from 'styled-components';
import palette from 'styles/palette';

export const AnimatedContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 756px;
  z-index: 1102;
`;

export const WorkflowDrawerContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0;
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15);
  background-color: ${palette.white};
  overflow-y: auto;
  overflow-x: hidden;
`;

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  z-index: 100;
`;

export const SectionContainer = styled.div`
  padding: 16px 32px 16px 32px;

  ${({ withBackground }) =>
    withBackground && `background: ${palette.coolGrey4};`}
`;

export const SectionSpacer = styled.hr`
  margin: 0;
  border-color: ${palette.coolGrey2};
  height: 1px;
`;
