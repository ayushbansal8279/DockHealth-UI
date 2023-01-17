import styled from 'styled-components';
import { motion } from 'framer-motion/dist/framer-motion';

export const AnimatedContainer = styled(motion.div)`
  position: absolute;
  left: 50%;
  bottom: 0;
  z-index: 1000;
`;
