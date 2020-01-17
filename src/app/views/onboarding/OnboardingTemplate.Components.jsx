import ButtonBase from '@material-ui/core/ButtonBase';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import styled from 'styled-components';
import MaskedInput from 'react-text-mask';
import { useFormContext } from 'react-hook-form';

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
  padding: 3.25rem;
`;

export const OnboardingH1 = styled.h1`
  color: #2e3a43;
  font-size: 2.125rem;
  margin: 0.25rem 0;
`;

export const OnboardingH1Bold = styled(OnboardingH1)`
  font-weight: bold;
`;

export const OnboardingH2 = styled.h2`
  color: #2e3a43;
  font-size: 1.3125rem;
  margin: 0.15rem 0;
`;

export const OnboardingH2Bold = styled(OnboardingH2)`
  font-weight: bold;
`;

export const OnboardingH3 = styled.h3`
  color: #2e3a43;
  font-size: 1rem;
  margin: 0.05rem 0;
`;

export const OnboardingH3Bold = styled(OnboardingH3)`
  font-weight: bold;
`;

export const OnboardingH4 = styled.h4`
  color: #2e3a43;
  font-size: 0.75rem;
  margin: 0.0125rem 0;
`;

export const OnboardingH4Error = styled(OnboardingH4)`
  color: #e40909;
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
    marginBottom: '0.5rem',
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
    height: '100%',
    zIndex: 1,
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
  },
})(InputBase);

export const OnboardingButton = withStyles({
  root: {
    borderRadius: '0.25rem',
    height: '4rem',
    padding: '0.5rem 1.5rem',
    transition: 'all 0.25s ease-out',
  },
  contained: {
    backgroundColor: '#fdb42b',
    color: '#565b5f',
    minWidth: '15rem',
  },
  containedAutoWidth: {
    backgroundColor: '#fdb42b',
    color: '#565b5f',
  },
  containedDisabled: {
    backgroundColor: '#c8c8ce',
  },
  containedAutoWidthDisabled: {
    backgroundColor: '#c8c8ce',
  },
  outlined: {
    color: '#303538',
  },
  outlinedLink: {
    color: '#0ca1c7',
  },
})(({ classes, variant, disabled, ...props }) => {
  const className = `${classes.root} ${classes[variant]} ${
    disabled ? classes[`${variant}Disabled`] ?? '' : ''
  }`.trim();

  return <ButtonBase disabled={disabled} className={className} {...props} />;
});

export const OnboardingAdditionalFormControlText = styled.div`
  padding: 0.5rem 1.5rem;
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
    showMask
    guide
  />
);

export const OnboardingInput = ({
  label,
  name,
  placeholder,
  CustomComponent = undefined,
  required = false,
  InputBaseProps = {},
}) => {
  const { register, errors } = useFormContext();
  const error = errors?.[name]?.message;

  return (
    <>
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
      <OnboardingH4Error>{error}</OnboardingH4Error>
    </>
  );
};

export const OnboardingDivider = styled.div`
  background-color: #dedee2;
  height: 0.0625rem;
  width: 100%;
`;
