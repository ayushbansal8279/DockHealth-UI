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
  width: 100%;
  height: 100%;
  z-index: 1;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

export const targetHandleStyles = {
  width: 12,
  height: 12,
  background: '#fff',
  border: '2px solid #999',
  borderRadius: '50%',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'auto',
  zIndex: 10,
};
