import React from 'react';
import { useDispatch } from 'react-redux';
import { MenuItem, Paper, MenuList } from '@material-ui/core';
import { updateTasksLink } from 'actions/task-actions';
import HardDependencyIcon from 'img/template/hard-dependency';
import { getEdgeCenter } from 'react-flow-renderer';
import LinkPath from '../LinkPath/LinkPath';
import {
  LabelsWrapper,
  HardDependencyLabel,
  MenuWrapper,
  useMenuStyles,
  MenuItemIconWrapper,
} from './styled';

const TaskLink = props => {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
    data: { link },
  } = props;
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const menuClasses = useMenuStyles();
  const dispatch = useDispatch();

  const toggleDependent = () => {
    dispatch(updateTasksLink({ ...link, isDependent: !link.isDependent }));
  };

  return (
    <>
      <LinkPath {...props} />
      <foreignObject
        width={160}
        height={32}
        x={edgeCenterX - 160 / 2}
        y={edgeCenterY - 32 / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
        style={{ overflow: 'visible' }}
      >
        <LabelsWrapper>
          {link.isDependent && (
            <HardDependencyLabel>
              <HardDependencyIcon />
            </HardDependencyLabel>
          )}
          {selected && (
            <MenuWrapper>
              <Paper>
                <MenuList classes={menuClasses}>
                  <MenuItem onClick={toggleDependent}>
                    <MenuItemIconWrapper>
                      <HardDependencyIcon size={11} />
                    </MenuItemIconWrapper>
                    {link.isDependent ? 'Remove' : 'Make'} dependent
                  </MenuItem>
                </MenuList>
              </Paper>
            </MenuWrapper>
          )}
        </LabelsWrapper>
      </foreignObject>
    </>
  );
};

export default TaskLink;
