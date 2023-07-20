import palette from 'styles/palette';
import styled from 'styled-components';
import MuiAddIcon from '@mui/icons-material/Add';

const NODE_HANDLE_SIZE = 14;

export const AddIcon = styled(MuiAddIcon)`
  &&& {
    &.MuiAddIcon-root {
      width: ${0.8 * NODE_HANDLE_SIZE}px;
      height: ${0.8 * NODE_HANDLE_SIZE}px;
      color: ${palette.white};
      pointer-events: none;
    }
  }
`;

export const TargetHandlesWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  width: 100%;
  height: 100%;
  z-index: 1;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

export const targetHandleStyles = {
  position: 'static',
  width: '100%',
  height: '100%',
  borderRadius: 0,
  border: 'none',
  transform: 'translate(0, 0)',
  background: 'transparent',
};
