import styled from 'styled-components';

export const StyledLabel = styled.div`
  color: #ababb2;
  left: 1rem;
  font-size: 14px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.2s ease-out;
  will-change: top;
  z-index: 1;
`;

export const StyledInputIcon = styled.div`
  background-image: none;
  background-position: center;
  background-size: contain;
  bottom: 1rem;
  height: 1rem;
  position: absolute;
  right: 1rem;
  width: 1rem;
  z-index: 1;
`;

export const StyledInput = styled.input`
  color: #000;
  background-color: transparent;
  box-shadow: none;
  font-size: 14px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  height: 100%;
  margin-bottom: 0;
  outline: none;
  padding: 1rem 2.5rem 0 1rem;

  ${props => props.isPassword && 'padding-right: 5rem;'}

  &:focus, &:active {
    background-color: transparent;
    box-shadow: none;
  }

  &:focus ~ ${StyledLabel}, &:not([value='']) ~ ${StyledLabel} {
    top: 25%;
  }

  &.error ~ ${StyledInputIcon} {
    background-image: url(assets/img/svg/cross.svg);
    cursor: pointer;
  }

  && {
    border: 1.5px solid transparent;

    &:focus {
      border: 1.5px solid #dedee2;
    }

    &.error {
      border: 1.5px solid #e40909;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:active,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      transition: all 0.25s ease-out, -webkit-box-shadow 0s;
      -webkit-box-shadow: 0 0 0 40px rgba(243, 245, 246) inset !important;
    }
  }
`;

export const StyledInputContainer = styled.div`
  background-color: #f3f5f6;
  border-radius: 0;
  box-sizing: border-box;
  position: relative;
  height: 3.75rem;
  margin-top: 1.5rem;
  ${props => props.invisible && 'opacity: 0;'}
`;

export const StyledErrorLabel = styled.div`
  color: #e40909;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  position: absolute;
  top: -1.5em;
`;

export const StyledPasswordSwitch = styled.div`
  bottom: 1rem;
  color: rgba(48, 53, 56, 0.8);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 300;
  height: 1rem;
  line-height: 1rem;
  position: absolute;
  right: 2.5rem;
  text-align: right;
  user-select: none;
  z-index: 1;
`;
