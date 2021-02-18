import React, { useCallback } from 'react';
import useBoolean from 'hooks/useBoolean';
import palette from 'styles/palette';
import {
  CheckboxContainer,
  StyledCheckIcon,
  StyledOutLinesTop,
  StyledOutlinesBottom,
  StyledOutlinesLeft,
  StyledOutlinesRight,
  StyledOutLineTopRight,
  StyledOutLineBottomRight,
  StyledOutLineTopLeft,
  StyledOutLineBottomLeft,
} from './styled';

const getCheckboxSizeVariables = size => ({
  lineHeight: size / 7.5,
  lineOffset: size / 6,
});

const CheckMarkCheckbox = ({
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

export default CheckMarkCheckbox;
