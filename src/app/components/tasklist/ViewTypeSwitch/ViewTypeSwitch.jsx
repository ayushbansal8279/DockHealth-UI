import React from 'react';
import FullViewIcon from 'img/list/FullViewIcon';
import SlimViewIcon from 'img/list/SlimViewIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { Container, ViewTypeButton, ViewTypeButtonsWrapper } from './styled';

export const ViewType = {
  FULL_VIEW: 'FULL_VIEW',
  SLIM_VIEW: 'SLIM_VIEW',
};

const ViewTypeSwitch = ({ isHidden, value, onChange }) => (
  <Container isHidden={isHidden}>
    <ViewTypeButtonsWrapper>
      <Tooltip placement="top" title="Slim view. Just the task shows">
        <ViewTypeButton
          type="button"
          active={value === ViewType.SLIM_VIEW}
          onClick={() => {
            onChange(ViewType.SLIM_VIEW);
          }}
        >
          <SlimViewIcon />
        </ViewTypeButton>
      </Tooltip>
      <Tooltip placement="top" title="Full view. Task and comments show">
        <ViewTypeButton
          type="button"
          active={value === ViewType.FULL_VIEW}
          onClick={() => {
            onChange(ViewType.FULL_VIEW);
          }}
        >
          <FullViewIcon />
        </ViewTypeButton>
      </Tooltip>
    </ViewTypeButtonsWrapper>
  </Container>
);

export default ViewTypeSwitch;
