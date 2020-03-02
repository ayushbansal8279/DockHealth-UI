import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Link } from 'react-router';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';

export const OnboardingBackground = styled.div`
  background-color: #fff;
  min-height: 100%;
  width: 100%;
`;

export const OnboardingNavbar = styled.nav`
  align-items: center;
  box-shadow: 0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  border-top: 0.5rem solid #074a86;
  display: flex;
  height: 5.75rem;
  justify-content: space-between;
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

export const OnboardingProgressBar = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: space-around;
  position: relative;
  width: 20rem;
`;

export const OnboardingProgressTrack = styled.div`
  background-color: #f3f5f6;
  border-radius: 0.125rem;
  height: 0.25rem;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  z-index: 1;
`;

export const OnboardingProgressTrackActive = styled.div`
  background-color: #fdb42b;
  height: 100%;
  transition: all 0.25s ease-out;
  width: ${props => (props.width ?? 0) * 100}%;
`;

export const OnboardingProgressDotContainer = styled.div`
  background-color: #fff;
  border-radius: 0.625rem;
  height: 1.25rem;
  padding: 0.125rem;
  position: relative;
  width: 1.25rem;
  z-index: 2;
`;

export const OnboardingProgressDot = styled.div`
  background-color: #fff;
  border: 0.125rem solid #ededf0;
  border-radius: 50%;
  height: 100%;
  transition: all 0.25s ease-out;
  width: 100%;

  ${props =>
    props.active &&
    `
    background-color: #fdb42b;
    border: 0.125rem solid #fdb42b;
  `}
  ${props =>
    props.current &&
    `
    border: 0.125rem solid #fdb42b;
  `}
`;

export const OnboardingProgressLabel = styled.div`
  font-size: 0.625rem;
  left: 50%;
  opacity: ${props => (props.active ? 1 : 0)};
  position: absolute;
  top: 1.5rem;
  transform: translateX(-50%);
  transition: all 0.25s ease-out;
  user-select: none;
  white-space: nowrap;
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
  color: #e40909;
  margin: 0.5rem 0 0;
  user-select: none;
`;

export const OnboardingH4Toggle = styled(OnboardingH4)`
  color: #ababb2;
  cursor: pointer;
  padding-right: 0.75rem;
  user-select: none;
`;

export const OnboardingFieldsRequiredLabel = styled(OnboardingH3)`
  padding-left: 1rem;
  position: relative;

  &::before {
    color: #d9036b;
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
    backgroundColor: '#f3f5f6',
    height: '4rem',
  },
})(FormControl);

export const OnboardingInputLabel = withStyles({
  root: {
    color: '#2e3a43',
    pointerEvents: 'none',
    top: '50%',
    transform: 'translate(1.5rem, -50%) scale(1)',
    transition: 'all 200ms ease',
    zIndex: 2,
  },
  required: {
    '& > span': {
      color: '#f00',
    },
  },
  shrink: {
    color: '#ababb2',
    top: '5%',
    transform: 'translate(1.5rem, 0) scale(0.65)',
    transformOrigin: 'center left',
    transition: 'all 200ms ease',
  },
  focused: {
    color: '#ababb2 !important',
  },
})(InputLabel);

export const OnboardingInputBase = withStyles({
  root: {
    border: '0.0625rem solid #e4090900',
    height: '100%',
    transition: 'all 0.2s ease-out',
    zIndex: 1,
  },
  error: {
    border: '0.0625rem solid #e40909',
  },
  input: {
    borderRadius: '0.25rem',
    boxShadow: 'none',
    fontFamily: '"Open Sans", sans-serif',
    paddingBottom: 0,
    padding: '0.6rem 1.5rem',
    '&:focus': {
      backgroundColor: '#f3f5f6',
      border: 0,
      boxShadow: 'none',
    },
    '&[readonly], &[disabled]': {
      backgroundColor: '#f3f5f6',
      cursor: 'pointer',
    },
  },
})(InputBase);

export const OnboardingButton = withStyles({
  root: {
    borderRadius: '0.25rem',
    height: '4rem',
    padding: '0.5rem 1.5rem',
    transition: 'all 0.25s ease-out',
    whiteSpace: 'nowrap',
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
    backgroundColor: '#007cab',
    color: '#fff',
    minWidth: '20rem',
  },
  containedAutoWidth: {
    backgroundColor: '#007cab',
    color: '#fff',
    fontWeight: 'bold',
  },
  containedDisabled: {
    backgroundColor: '#c1ccda',
  },
  containedAutoWidthDisabled: {
    backgroundColor: '#c1ccda',
  },
  outlined: {
    color: '#303538',
  },
  outlinedError: {
    color: '#e40909',
  },
  outlinedLink: {
    color: '#0ca1c7',
  },
  outlinedSkip: {
    color: '#0ca1c7',
    padding: '0.5rem 0.25rem',
  },
  fullWidth: {
    width: '100%',
  },
})(({ classes, variant, size, fullWidth, disabled, ...props }) => {
  const className = `${classes.root} ${classes[variant]} ${classes[size] ??
    ''} ${disabled ? classes[`${variant}Disabled`] ?? '' : ''} ${
    fullWidth ? classes.fullWidth : ''
  }`.trim();

  return <ButtonBase disabled={disabled} className={className} {...props} />;
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
  InputBaseProps = {},
}) => {
  const { register, errors } = useFormContext();
  const error = errors?.[name]?.message;

  return (
    <div ref={inputContainerReference}>
      <OnboardingFormControl fullWidth>
        <OnboardingInputLabel required={required}>{label}</OnboardingInputLabel>
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

export const OnboardingDialog = withStyles({
  paper: {
    padding: '1.5rem 2rem',
  },
})(Dialog);

export const OnboardingDivider = styled.div`
  background-color: #dedee2;
  height: 0.0625rem;
  width: 100%;
`;

export const OnboardingAnchor = styled.a`
  color: #007cab;
  filter: brightness(1);
  transition: all 0.25s ease-out;

  &:hover {
    color: #007cab;
    filter: brightness(1.35);
  }
`;

export const OnboardingLink = styled(Link)`
  color: #007cab;
  filter: brightness(1);
  transition: all 0.25s ease-out;

  &:hover {
    color: #007cab;
    filter: brightness(1.35);
  }
`;
