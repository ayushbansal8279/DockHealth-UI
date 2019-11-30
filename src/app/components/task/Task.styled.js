import ButtonBase from '@material-ui/core/ButtonBase';
import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import styled from 'styled-components';

export const TaskAnimationContainer = styled.div`
  ${props => props.isSubtask && 'background-color: #fff;'}
  height: ${props => (props.isNewSubtask ? 0 : 'auto')};
  ${props => !props.drawerOpen && 'max-width: 1050px;'}
  overflow: hidden;
  transition: height 0.25s ease-out;
`;

export const TaskContainer = styled.div`
  box-sizing: border-box;
  background-color: #fff;
  height: min-content;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0.25rem;
  transition: all 0.25s ease-out;

  ${props =>
    props.isSubtask &&
    `
    margin: 3px 4px 3px 15px;

    > div {
      border: 1px solid #ededf0;
    }
  `}
`;

const CollapsibleButton = ({ classes, isCollapsed, ...props }) => {
  const className = `${classes.root} ${
    classes[isCollapsed ? ' collapsed' : '']
  }`;

  return <ButtonBase className={className} {...props} />;
};

const collapsibleButtonStyles = {
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    height: '44px',
    borderRadius: '1px',
    border: 'solid 3px',
    borderColor: 'transparent',
    fontSize: '16px',
    lineHeight: '38px',
    color: '#2e3a43',
    paddingLeft: '15px',
  },
  collapsed: {
    borderColor: '#f5f8fa',
  },
};

export const SubtasksContainer = withStyles(collapsibleButtonStyles)(
  CollapsibleButton,
);

export const TaskSelectionContainer = styled.div`
  align-items: center;
  background-color: ${props => props.isSelected && '#ddf2f7'};
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  height: min-content;
  min-height: 3.875rem;
  transition: all 0.25s ease-out;
`;

export const SubtaskOrderContainer = styled.div`
  align-items: center;
  color: #303538;
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  font-weight: bold;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 1.375rem;
`;

export const SubtaskLoadingContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  width: 60px;
  justify-content: center;
`;
