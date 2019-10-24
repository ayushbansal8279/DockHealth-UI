import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import CheckIcon from '../../img/checkbox-check';

import useBoolean from '../../hooks/useBoolean';

export const Confirmation = ({ isOpen, close, confirm }) => (
  <Dialog
    open={isOpen}
    onClose={close}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      You are about to complete a task with open subtasks. Completing the task
      will also complete the subtasks. Would you like to proceed?
    </DialogTitle>
    <DialogActions>
      <Button onClick={close} color="primary">
        Cancel
      </Button>
      <Button onClick={confirm} color="primary" autoFocus>
        Complete all
      </Button>
    </DialogActions>
  </Dialog>
);

const LINE_HEIGHT = 4;
const LINE_OFFSET = 5;
const CHECKBOX_SIZE = 30;

const CheckboxContainer = styled.div`
  && {
    align-items: center;
    background-color: #fff;
    border: 2px solid #aab8c3;
    border-radius: 5px;
    box-shadow: 0px 2px 4px #ccd6dd;
    cursor: pointer;
    display: inline-flex;
    height: 30px;
    justify-content: center;
    position: relative;
    transition: border 0.2s ease-out, background-color 0.2s ease-out;
    width: 30px;

    &:hover {
      background-color: #20b255;
      border: 2px solid #aab8c3;
    }

    ${props =>
      props.checked &&
      `
      background-color: #20b255;
      border: 0;
    `}
  }
`;

const CheckboxOutLines = ({ className }) => (
  <svg
    height={LINE_HEIGHT}
    width={CHECKBOX_SIZE}
    viewBox={`0 0 ${CHECKBOX_SIZE} ${LINE_HEIGHT}`}
    stroke="#20b255"
    strokeWidth="1.5"
    className={className}
  >
    <path
      d={`M ${(CHECKBOX_SIZE * 1) / 6} ${LINE_HEIGHT} L ${(CHECKBOX_SIZE * 1) /
        6} 0`}
    />
    <path
      d={`M ${(CHECKBOX_SIZE * 2) / 6} ${LINE_HEIGHT} L ${(CHECKBOX_SIZE * 2) /
        6} 0`}
    />
    <path
      d={`M ${(CHECKBOX_SIZE * 3) / 6} ${LINE_HEIGHT} L ${(CHECKBOX_SIZE * 3) /
        6} 0`}
    />
    <path
      d={`M ${(CHECKBOX_SIZE * 4) / 6} ${LINE_HEIGHT} L ${(CHECKBOX_SIZE * 4) /
        6} 0`}
    />
    <path
      d={`M ${(CHECKBOX_SIZE * 5) / 6} ${LINE_HEIGHT} L ${(CHECKBOX_SIZE * 5) /
        6} 0`}
    />
  </svg>
);

const outLinesStyle = `
  && {
    animation: dash 0.3s ease-out forwards;
    position: absolute;
    stroke-dasharray: ${LINE_HEIGHT};
    stroke-dashoffset: ${LINE_HEIGHT};

    @keyframes dash {
      0% {
        stroke-dashoffset: ${LINE_HEIGHT};
      }
      100% {
        stroke-dashoffset: -${LINE_HEIGHT};
      }
    }
  }
`;

const StyledOutLinesBase = styled(CheckboxOutLines)`
  ${outLinesStyle}
`;

const StyledOutLinesTop = styled(StyledOutLinesBase)`
  top: -${LINE_OFFSET + LINE_HEIGHT}px;
`;

const StyledOutlinesBottom = styled(StyledOutLinesBase)`
  bottom: -${LINE_OFFSET + LINE_HEIGHT}px;
  transform: rotate(180deg);
`;

const StyledOutlinesLeft = styled(StyledOutLinesBase)`
  left: -${CHECKBOX_SIZE / 2 + LINE_OFFSET + LINE_HEIGHT / 2}px;
  top: ${CHECKBOX_SIZE / 2 - LINE_HEIGHT}px;
  transform: rotate(270deg);
`;

const StyledOutlinesRight = styled(StyledOutLinesBase)`
  right: -${CHECKBOX_SIZE / 2 + LINE_OFFSET + LINE_HEIGHT / 2}px;
  top: ${CHECKBOX_SIZE / 2 - LINE_HEIGHT}px;
  transform: rotate(90deg);
`;

const CheckboxOutLine = ({ className }) => (
  <svg
    height={LINE_HEIGHT}
    width="2"
    viewBox={`0 0 2 ${LINE_HEIGHT}`}
    stroke="#20b255"
    strokeWidth="1.5"
    className={className}
  >
    <path d={`M 1 ${LINE_HEIGHT} L 1 0`} />
  </svg>
);

const StyledOutLineBase = styled(CheckboxOutLine)`
  ${outLinesStyle}
`;

const StyledOutLineTopRight = styled(StyledOutLineBase)`
  right: -6px;
  top: -6px;
  transform: rotate(45deg);
`;

const StyledOutLineBottomRight = styled(StyledOutLineBase)`
  right: -6px;
  bottom: -6px;
  transform: rotate(135deg);
`;

const StyledOutLineTopLeft = styled(StyledOutLineBase)`
  left: -6px;
  top: -6px;
  transform: rotate(-45deg);
`;

const StyledOutLineBottomLeft = styled(StyledOutLineBase)`
  left: -6px;
  bottom: -6px;
  transform: rotate(-135deg);
`;

const StyledCheckIcon = styled(CheckIcon)`
  && {
    stroke-dasharray: 32px;
    stroke-dashoffset: 32px;
    transition: all 0.3s ease-out;

    ${props => props.checked && `stroke-dashoffset: 0px;`}
  }
`;

const TaskCheckbox = ({ checked, onChange, onClick = () => {}, disabled }) => {
  const [outlinesShown, showOutlines, hideOutlines] = useBoolean(false);

  const triggerOutlinesAnimation = useCallback(() => {
    showOutlines();

    setTimeout(() => {
      hideOutlines();
    }, 500);
  });

  return (
    <CheckboxContainer
      onClick={e => {
        if (!outlinesShown && !disabled) {
          onClick(e);
          onChange({ target: { checked: !checked } });
          triggerOutlinesAnimation();
        }
      }}
      disabled={disabled}
      checked={checked}
    >
      <span>
        <StyledCheckIcon checked={checked} />
      </span>
      {outlinesShown && (
        <>
          <StyledOutLinesTop />
          <StyledOutlinesBottom />
          <StyledOutlinesLeft />
          <StyledOutlinesRight />
          <StyledOutLineTopRight />
          <StyledOutLineBottomRight />
          <StyledOutLineTopLeft />
          <StyledOutLineBottomLeft />
        </>
      )}
    </CheckboxContainer>
  );
};
export default TaskCheckbox;
