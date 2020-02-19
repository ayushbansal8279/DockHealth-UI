import React, { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

import useBoolean from '../../hooks/useBoolean';
import CheckIcon from '../../img/checkbox-check';

const LINE_HEIGHT = 4;
const LINE_OFFSET = 5;
const CHECKBOX_SIZE = 30;

const CheckboxContainer = styled.div`
  && {
    align-items: center;
    background-color: #fff;
    border: 1px solid #aab8c3;
    border-radius: 5px;
    box-shadow: 0px 2px 4px #ccd6dd;
    cursor: pointer;
    display: inline-flex;
    height: 30px;
    justify-content: center;
    min-height: 30px;
    min-width: 30px;
    opacity: ${props => (props.disabled ? 0.5 : 1)};
    position: relative;
    transition: all 0.2s ease-out;
    width: 30px;

    &:hover {
      background-color: ${props => (props.disabled ? '#fff' : props.color)};
      border: 1px solid #aab8c3;
      ${props => props.disabled && 'cursor: not-allowed;'}
    }

    ${props =>
      props.checked &&
      `
      background-color: ${props.color};
      border: 0;
    `}
  }
`;

const CheckboxOutLines = ({ className, color }) => (
  <svg
    height={LINE_HEIGHT}
    width={CHECKBOX_SIZE}
    viewBox={`0 0 ${CHECKBOX_SIZE} ${LINE_HEIGHT}`}
    stroke={color}
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

const dashAnimation = keyframes`
  from {
    stroke-dashoffset: ${LINE_HEIGHT};
  }
  to {
    stroke-dashoffset: -${LINE_HEIGHT};
  }
`;

const outLinesStyle = `
  && {
    position: absolute;
    stroke-dasharray: ${LINE_HEIGHT};
    stroke-dashoffset: ${LINE_HEIGHT};
  }
`;

const StyledOutLinesBase = styled(CheckboxOutLines)`
  animation: ${dashAnimation} 0.3s ease-out forwards 0s 1;
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

const CheckboxOutLine = ({ className, color }) => (
  <svg
    height={LINE_HEIGHT}
    width="2"
    viewBox={`0 0 2 ${LINE_HEIGHT}`}
    stroke={color}
    strokeWidth="1.5"
    className={className}
  >
    <path d={`M 1 ${LINE_HEIGHT} L 1 0`} />
  </svg>
);

const StyledOutLineBase = styled(CheckboxOutLine)`
  animation: ${dashAnimation} 0.3s ease-out forwards;
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
    stroke-dashoffset: 40px;
    transition: all 0.3s ease-out;

    ${props =>
      props.checked && `stroke-dasharray: 30px; stroke-dashoffset: 0px;`}
  }
`;

const TaskCheckbox = ({
  checked,
  onChange,
  onClick = () => {},
  disabled,
  className,
  color = '#20b255',
}) => {
  const [outlinesShown, showOutlines, hideOutlines] = useBoolean(false);

  const triggerOutlinesAnimation = useCallback(() => {
    showOutlines();

    setTimeout(() => {
      hideOutlines();
    }, 500);
  }, [hideOutlines, showOutlines]);

  return (
    <CheckboxContainer
      onClick={event => {
        if (!outlinesShown && !disabled) {
          onClick(event);
          onChange({ target: { checked: !checked } });
          triggerOutlinesAnimation();
        }
      }}
      disabled={disabled}
      checked={checked}
      className={className}
      color={color}
    >
      <span>
        <StyledCheckIcon checked={checked} />
      </span>
      {outlinesShown && (
        <>
          <StyledOutLinesTop color={color} />
          <StyledOutlinesBottom color={color} />
          <StyledOutlinesLeft color={color} />
          <StyledOutlinesRight color={color} />
          <StyledOutLineTopRight color={color} />
          <StyledOutLineBottomRight color={color} />
          <StyledOutLineTopLeft color={color} />
          <StyledOutLineBottomLeft color={color} />
        </>
      )}
    </CheckboxContainer>
  );
};

export default TaskCheckbox;
