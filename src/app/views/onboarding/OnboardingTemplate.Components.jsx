import {
  ButtonBase,
  Collapse,
  Dialog,
  FormControl,
  InputBase,
  InputLabel,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Link } from 'react-router';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';
import clsx from 'clsx';
import palette, { opacify } from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';

export const OnboardingBackground = styled.div`
  background-color: ${palette.white};
  min-height: 100%;
  width: 100%;
`;

export const OnboardingNavbar = styled.nav`
  align-items: center;
  background-color: ${palette.midnightBlue};
  display: flex;
  height: 5.75rem;
  justify-content: flex-end;
  padding: 1rem 2.375rem;
  width: 100%;

  > a {
    height: 100%;
  }
`;

export const OnboardingLogo = styled.img`
  height: 100%;
  object-fit: contain;
`;

export const OnboardingMainContainer = styled.main`
  box-sizing: content-box;
  margin: 0 auto;
  max-width: 946px;
  padding: ${props => (props.isSmallScreen ? 0.5 : 3.25)}rem;
`;

export const OnboardingH1 = styled.h1`
  font-size: 2.25rem;
  margin: 0.25rem 0;
`;

export const OnboardingH1Bold = styled(OnboardingH1)`
  font-weight: bold;
`;

export const OnboardingH2 = styled.h2`
  font-size: 1.3125rem;
  margin: 0.15rem 0;
`;

export const OnboardingH2Bold = styled(OnboardingH2)`
  font-weight: bold;
`;

export const OnboardingH3 = styled.h3`
  font-size: 1rem;
  margin: 0.05rem 0;
`;

export const OnboardingH3Bold = styled(OnboardingH3)`
  font-weight: bold;
`;

export const OnboardingH4 = styled.h4`
  font-size: 0.75rem;
  margin: 0.0125rem 0;
`;

export const OnboardingH4Error = styled(OnboardingH4)`
  color: ${palette.error};
  margin: 0.5rem 0 0;
  user-select: none;
`;

export const OnboardingH4Toggle = styled(OnboardingH4)`
  color: ${palette.unknownGrey5};
  cursor: pointer;
  padding-right: 0.75rem;
  user-select: none;
`;

export const OnboardingFieldsRequiredLabel = styled(OnboardingH3)`
  padding-left: 1rem;
  position: relative;

  &::before {
    color: ${palette.vividPink};
    content: '*';
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 1rem;
  }
`;

const OnboardingSpacing = styled.div`
  width: 100%;
`;

export const OnboardingSpacing1 = styled(OnboardingSpacing)`
  height: 0.25rem;
`;

export const OnboardingSpacing2 = styled(OnboardingSpacing)`
  height: 0.5rem;
`;

export const OnboardingSpacing3 = styled(OnboardingSpacing)`
  height: 1rem;
`;

export const OnboardingSpacing4 = styled(OnboardingSpacing)`
  height: 2rem;
`;

export const OnboardingSpacing5 = styled(OnboardingSpacing)`
  height: 4rem;
`;

export const OnboardingSpacing6 = styled(OnboardingSpacing)`
  height: 8rem;
`;

const OnboardingHorizontalSpacing = styled.div`
  height: auto;
`;

export const OnboardingHorizontalSpacing1 = styled(OnboardingHorizontalSpacing)`
  width: 0.25rem;
`;

export const OnboardingHorizontalSpacing2 = styled(OnboardingHorizontalSpacing)`
  width: 0.5rem;
`;

export const OnboardingHorizontalSpacing3 = styled(OnboardingHorizontalSpacing)`
  width: 1rem;
`;

export const OnboardingHorizontalSpacing4 = styled(OnboardingHorizontalSpacing)`
  width: 2rem;
`;

export const OnboardingFormControl = withStyles({
  root: {
    backgroundColor: palette.lightGrey,
    height: '4rem',
  },
})(FormControl);

export const OnboardingInputLabel = withStyles({
  root: {
    color: palette.greyBlue,
    pointerEvents: 'none',
    top: '50%',
    transform: 'translate(1.5rem, -50%) scale(1)',
    transition: 'all 200ms ease',
    zIndex: 2,
  },
  required: {
    '& > span': {
      color: palette.error,
    },
  },
  shrink: {
    color: palette.unknownGrey5,
    top: '5%',
    transform: 'translate(1.5rem, 0) scale(0.65)',
    transformOrigin: 'center left',
    transition: 'all 200ms ease',
  },
  focused: {
    color: `${palette.unknownGrey5} !important`,
  },
})(InputLabel);

export const OnboardingInputBase = withStyles({
  root: {
    border: `0.0625rem solid ${opacify(palette.error, 0)}`,
    height: '100%',
    transition: 'all 0.2s ease-out',
    zIndex: 1,
  },
  error: {
    border: `0.0625rem solid ${palette.error}`,
  },
  input: {
    borderRadius: '0.25rem',
    boxShadow: 'none',
    fontFamily: '"Open Sans", sans-serif',
    paddingBottom: 0,
    padding: '0.6rem 1.5rem',
    '&:focus': {
      backgroundColor: palette.lightGrey,
      border: 0,
      boxShadow: 'none',
    },
    '&[readonly], &[disabled]': {
      backgroundColor: palette.lightGrey,
      cursor: 'pointer',
    },
  },
})(InputBase);

export const OnboardingButton = withStyles({
  root: {
    borderRadius: 0,
    fontSize: '1rem',
    height: '3.125rem',
    padding: '0.25rem 1.5rem',
    position: 'relative',
    textTransform: 'uppercase',
    transition: 'all 0.25s ease-out',
    whiteSpace: 'nowrap',
    '&::before': {
      backgroundColor: palette.darkBlue,
      content: '""',
      height: '100%',
      left: 0,
      opacity: 0,
      position: 'absolute',
      top: 0,
      transition: 'all 0.25s ease-out',
      width: '100%',
      zIndex: 0,
    },
  },
  small: {
    '&&': {
      height: '2.5rem',
      padding: '0.5rem 0.75rem',
    },
  },
  narrow: {
    '&&': {
      minWidth: '12rem',
    },
  },
  contained: {
    background: `linear-gradient(to top right, ${palette.brightBlue}, ${palette.darkBlue})`,
    color: palette.white,
    minWidth: '20rem',
    '&:hover::before': {
      opacity: 1,
    },
  },
  containedAutoWidth: {
    background: `linear-gradient(to top right, ${palette.brightBlue}, ${palette.darkBlue})`,
    color: palette.white,
    '&:hover::before': {
      opacity: 1,
    },
  },
  containedDisabled: {
    background: palette.white,
    border: `0.125rem solid ${palette.coolGrey1}`,
    color: palette.coolGrey1,
  },
  containedAutoWidthDisabled: {
    background: palette.white,
    border: `0.125rem solid ${palette.coolGrey1}`,
    color: palette.coolGrey1,
  },
  outlined: {
    color: palette.unknownGrey1,
    textTransform: 'none',
  },
  outlinedError: {
    color: palette.error,
    textTransform: 'none',
  },
  outlinedLink: {
    color: palette.lighterCyanBlue,
    textTransform: 'none',
  },
  outlinedSkip: {
    color: palette.lighterCyanBlue,
    padding: '0.5rem 0.25rem',
    textTransform: 'none',
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    zIndex: 100,
  },
})(({ classes, variant, size, fullWidth, disabled, children, ...props }) => {
  const className = clsx(
    classes.root,
    classes[variant],
    classes[size],
    disabled && classes[`${variant}Disabled`],
    fullWidth && classes.fullWidth,
  );

  return (
    <ButtonBase disabled={disabled} className={className} {...props}>
      <MontserratTypography
        variant="h4"
        weight="600"
        className={clsx(classes.label)}
      >
        {children}
      </MontserratTypography>
    </ButtonBase>
  );
});

export const OnboardingAdditionalFormControlText = styled.div`
  padding: ${props => (props.isSmallScreen ? '0.5rem' : '0.5rem 1.5rem')};
  ${props => props.isSmallScreen && 'font-size: 0.875rem;'}
  ${props => props.thin && 'font-weight: 300;'}
`;

export const MobileInputComponent = ({ inputRef, ...otherProps }) => (
  <MaskedInput
    {...otherProps}
    ref={reference => {
      inputRef(reference ? reference.inputElement : null);
    }}
    mask={[
      '(',
      /[1-9]/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ]}
    guide
  />
);

export const OnboardingInput = ({
  label,
  name,
  placeholder,
  inputContainerReference = undefined,
  CustomComponent = undefined,
  required = false,
  shrink,
  InputBaseProps = {},
}) => {
  const { register, errors } = useFormContext();
  const error = errors?.[name]?.message;

  return (
    <div ref={inputContainerReference}>
      <OnboardingFormControl fullWidth>
        <OnboardingInputLabel
          required={required}
          shrink={typeof shrink === 'boolean' ? shrink : undefined}
        >
          {label}
        </OnboardingInputLabel>
        <OnboardingInputBase
          name={name}
          placeholder={placeholder}
          inputRef={register}
          error={Boolean(error)}
          inputComponent={CustomComponent}
          {...InputBaseProps}
        />
      </OnboardingFormControl>
      <Collapse in={error} timeout={150}>
        <OnboardingH4Error>{error}</OnboardingH4Error>
      </Collapse>
    </div>
  );
};

const OnboardingDialogComponent = ({
  classes,
  isSmallScreen,
  PaperProps,
  ...props
}) => {
  const paperClassName = isSmallScreen ? classes.smallPaper : classes.paper;

  return (
    <Dialog
      PaperProps={{
        ...(PaperProps ?? {}),
        className: paperClassName,
      }}
      {...props}
    />
  );
};

export const OnboardingDialog = withStyles({
  paper: {
    borderRadius: 0,
    padding: '1.5rem 2rem',
  },
  smallPaper: {
    borderRadius: 0,
    padding: '1rem',
  },
})(OnboardingDialogComponent);

export const OnboardingDivider = styled.div`
  background-color: ${palette.brightBlue};
  height: 0.0625rem;
  width: 100%;
`;

export const OnboardingAnchorDiv = styled.div`
  color: ${palette.darkBlue};
  cursor: pointer;
  display: inline-block;
  filter: brightness(1);
  text-decoration: underline;
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.darkBlue};
    filter: brightness(1.35);
  }
`;

export const OnboardingAnchor = styled.a`
  color: ${palette.darkBlue};
  filter: brightness(1);
  text-decoration: underline;
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.darkBlue};
    filter: brightness(1.35);
  }
`;

export const OnboardingLink = styled(Link)`
  color: ${palette.cyanBlue};
  filter: brightness(1);
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.cyanBlue};
    filter: brightness(1.35);
  }
`;

export const OnboardingSmallScreenLogo = styled.img.attrs({
  src: '/assets/img/dock-logo.svg',
  alt: 'Dock Health',
})`
  height: 7.25rem;
  min-height: 7.25rem;
`;
