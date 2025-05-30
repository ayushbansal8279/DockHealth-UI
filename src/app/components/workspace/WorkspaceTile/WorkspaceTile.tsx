import React from 'react';
import styled from 'styled-components';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

interface StyledTileProps {
  isDefaultTile: boolean;
  workspaceColor?: string;
  size: number;
}

const WorkspaceTileContainer = styled.div<StyledTileProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background-color: ${(props) =>
    props.isDefaultTile ? palette.coolGrey2 : props.workspaceColor};
  height: ${(props) => `${props.size}px`};
  min-height: ${(props) => `${props.size}px`};
  width: ${(props) => `${props.size}px`};
  min-width: ${(props) => `${props.size}px`};
  color: ${(props) => (props.isDefaultTile ? palette.coolGrey2 : 'white')};
  font-family: 'Outfit', sans-serif;
  font-size: ${(props) => `${props.size / 45}rem`};
  font-weight: ${fontWeights.bold};
`;

interface WorkspaceTileProps {
  workspaceProfileColor?: string;
  workspaceInitials?: string;
  size?: number;
}

const WorkspaceTile: React.FC<WorkspaceTileProps> = ({
  workspaceProfileColor,
  workspaceInitials,
  size = 30,
}) => {
  return (
    <WorkspaceTileContainer
      workspaceColor={workspaceProfileColor}
      size={size}
      isDefaultTile={!workspaceInitials}
    >
      {workspaceInitials || ''}
    </WorkspaceTileContainer>
  );
};

export default WorkspaceTile;
