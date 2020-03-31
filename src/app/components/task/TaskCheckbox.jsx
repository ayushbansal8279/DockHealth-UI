import React, { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import useBoolean from '../../hooks/useBoolean';
import CheckIcon from '../../img/checkbox-check';
import palette from '../../palette';

const getCheckboxSizeVariables = size => ({
  lineHeight: size / 7.5,
  lineOffset: size / 6,
});

const CheckboxContainer = styled.div`
  && {
    align-items: center;
    background-color: ${palette.white};
    border: 1px solid ${palette.unknownGrey3};
    border-radius: 5px;
    box-shadow: 0px 2px 4px ${palette.coolGrey2};
    cursor: pointer;
    display: inline-flex;
    height: ${props => props.size}px;
    justify-content: center;
    min-height: ${props => props.size}px;
    min-width: ${props => props.size}px;
    opacity: ${props => (props.disabled ? 0.5 : 1)};
    position: relative;
    transition: all 0.2s ease-out;
    width: ${props => props.size}px;

    &:hover {
      background-color: ${props =>
        props.disabled ? palette.white : props.color};
      border: 1px solid ${palette.unknownGrey3};
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

const CheckboxOutLines = ({ className, color, lineHeight, size }) => (
  <svg
    height={lineHeight}
    width={size}
    viewBox={`0 0 ${size} ${lineHeight}`}
    stroke={color}
    strokeWidth="1.5"
    className={className}
  >
    <path d={`M ${(size * 1) / 6} ${lineHeight} L ${(size * 1) / 6} 0`} />
    <path d={`M ${(size * 2) / 6} ${lineHeight} L ${(size * 2) / 6} 0`} />
    <path d={`M ${(size * 3) / 6} ${lineHeight} L ${(size * 3) / 6} 0`} />
    <path d={`M ${(size * 4) / 6} ${lineHeight} L ${(size * 4) / 6} 0`} />
    <path d={`M ${(size * 5) / 6} ${lineHeight} L ${(size * 5) / 6} 0`} />
  </svg>
);

const dashAnimation = lineHeight => keyframes`
  from {
    stroke-dashoffset: ${lineHeight};
  }
  to {
    stroke-dashoffset: -${lineHeight};
  }
`;

const outLinesStyle = lineHeight => `
  && {
    position: absolute;
    stroke-dasharray: ${lineHeight};
    stroke-dashoffset: ${lineHeight};
  }
`;

const StyledOutLinesBase = styled(CheckboxOutLines)`
  animation: ${props => dashAnimation(props.lineHeight)} 0.3s ease-out forwards
    0s 1;
  ${props => outLinesStyle(props.lineHeight)}
`;

const StyledOutLinesTop = styled(StyledOutLinesBase)`
  top: -${({ lineOffset, lineHeight }) => lineOffset + lineHeight}px;
`;

const StyledOutlinesBottom = styled(StyledOutLinesBase)`
  bottom: -${({ lineOffset, lineHeight }) => lineOffset + lineHeight}px;
  transform: rotate(180deg);
`;

const StyledOutlinesLeft = styled(StyledOutLinesBase)`
  left: -${({ size, lineOffset, lineHeight }) => size / 2 + lineOffset + lineHeight / 2}px;
  top: ${({ size, lineHeight }) => size / 2 - lineHeight}px;
  transform: rotate(270deg);
`;

const StyledOutlinesRight = styled(StyledOutLinesBase)`
  right: -${({ size, lineOffset, lineHeight }) => size / 2 + lineOffset + lineHeight / 2}px;
  top: ${({ size, lineHeight }) => size / 2 - lineHeight}px;
  transform: rotate(90deg);
`;

const CheckboxOutLine = ({ className, color, lineHeight }) => (
  <svg
    height={lineHeight}
    width="2"
    viewBox={`0 0 2 ${lineHeight}`}
    stroke={color}
    strokeWidth="1.5"
    className={className}
  >
    <path d={`M 1 ${lineHeight} L 1 0`} />
  </svg>
);

const StyledOutLineBase = styled(CheckboxOutLine)`
  animation: ${dashAnimation} 0.3s ease-out forwards;
  ${outLinesStyle}
`;

const StyledOutLineTopRight = styled(StyledOutLineBase)`
  right: -${props => props.lineOffset}px;
  top: -${props => props.lineOffset}px;
  transform: rotate(45deg);
`;

const StyledOutLineBottomRight = styled(StyledOutLineBase)`
  right: -${props => props.lineOffset}px;
  bottom: -${props => props.lineOffset}px;
  transform: rotate(135deg);
`;

const StyledOutLineTopLeft = styled(StyledOutLineBase)`
  left: -${props => props.lineOffset}px;
  top: -${props => props.lineOffset}px;
  transform: rotate(-45deg);
`;

const StyledOutLineBottomLeft = styled(StyledOutLineBase)`
  left: -${props => props.lineOffset}px;
  bottom: -${props => props.lineOffset}px;
  transform: rotate(-135deg);
`;

const StyledCheckIcon = styled(({ size }) => <CheckIcon size={size} />)`
  && {
    stroke-dasharray: ${props => props.size}px;
    stroke-dashoffset: ${props => props.size}px;
    transition: all 0.3s ease-out;

    ${props => props.checked && `stroke-dashoffset: 0px;`}
  }
`;

const TaskCheckbox = ({
  checked,
  onChange,
  onClick = () => {},
  disabled,
  className,
  color = palette.taskCheckboxGreen,
  size = 30,
}) => {
  const [outlinesShown, showOutlines, hideOutlines] = useBoolean(false);

  const triggerOutlinesAnimation = useCallback(() => {
    showOutlines();

    setTimeout(() => {
      hideOutlines();
    }, 500);
  }, [hideOutlines, showOutlines]);

  const { lineHeight, lineOffset } = getCheckboxSizeVariables(size);

  const checkboxSizeVariables = {
    lineHeight,
    lineOffset,
    size,
  };

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
      {...checkboxSizeVariables}
    >
      <span>
        <StyledCheckIcon {...checkboxSizeVariables} checked={checked} />
      </span>
      {outlinesShown && (
        <>
          <StyledOutLinesTop {...checkboxSizeVariables} color={color} />
          <StyledOutlinesBottom {...checkboxSizeVariables} color={color} />
          <StyledOutlinesLeft {...checkboxSizeVariables} color={color} />
          <StyledOutlinesRight {...checkboxSizeVariables} color={color} />
          <StyledOutLineTopRight {...checkboxSizeVariables} color={color} />
          <StyledOutLineBottomRight {...checkboxSizeVariables} color={color} />
          <StyledOutLineTopLeft {...checkboxSizeVariables} color={color} />
          <StyledOutLineBottomLeft {...checkboxSizeVariables} color={color} />
        </>
      )}
    </CheckboxContainer>
  );
};

export default TaskCheckbox;
