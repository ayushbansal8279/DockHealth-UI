/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { Fade, Popper } from '@material-ui/core';
import { openDrawer } from 'actions/workflow-drawer-actions';
import { checkIfShouldDisplayTooltip } from 'components/task/OverflowTooltip/OverflowTooltip';
import { useDispatch } from 'react-redux';
import Highlighter from 'react-highlight-words';
import {
  NameContainer,
  NameTooltip,
  TaskTemplateDescriptionIndicators,
  TaskTemplateContext,
} from './styled';

const TaskTemplateName = ({
  nameInputReference,
  templateGroup,
  nameInputValue,
  highlightedValue,
}) => {
  const dispatch = useDispatch();
  const { name, identifier } = templateGroup;

  return (
    <>
      <NameContainer
        onClick={() => {
          dispatch(openDrawer(identifier, templateGroup));
        }}
      >
        <>
          <Highlighter
            highlightClassName="list-highlight"
            searchWords={highlightedValue?.toLowerCase().split(/\s+/)}
            autoEscape
            textToHighlight={nameInputValue}
          />
          {templateGroup?.sourceTaskBundleTemplate && (
            <TaskTemplateDescriptionIndicators>
              <TaskTemplateContext>
                <span>{templateGroup?.sourceTaskBundleTemplate?.name}</span>
              </TaskTemplateContext>
            </TaskTemplateDescriptionIndicators>
          )}
        </>
      </NameContainer>
      <Popper
        anchorEl={nameInputReference?.current}
        placement="bottom-start"
        open={checkIfShouldDisplayTooltip(nameInputReference?.current)}
        style={{
          zIndex: 115,
          maxWidth: nameInputReference?.current?.offsetWidth || '650px',
        }}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <NameTooltip>{name}</NameTooltip>
          </Fade>
        )}
      </Popper>
    </>
  );
};
export default TaskTemplateName;
