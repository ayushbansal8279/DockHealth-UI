import {
  Button,
  ButtonBase,
  Collapse,
  FormControl,
  InputBase,
  InputLabel,
  List,
  ListItem,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import SearchIconImage from '../img/search-dark.svg';
import palette, { opacify } from '../palette';

export const FormContainer = styled.form`
  align-items: flex-start;
  background-color: ${palette.white};
  flex-basis: auto;
  flex-flow: column wrap;
  display: flex;
  max-width: 40rem;
  padding: 1.5rem;
  width: 100%;

  & > * {
    margin: 0.25rem 0;
  }
`;

export const FormLabel = styled.h1`
  color: ${palette.oPlusRed};
  font-size: 1.25rem;
  margin: 0;
`;

export const FormDivider = styled.hr`
  && {
    border-bottom: 0.125rem solid ${palette.unknownGrey6};
    left: -1.5rem;
    margin: 1rem 0;
    position: relative;
    width: calc(100% + 3rem);
  }
`;

export const StyledFormControl = withStyles({
  root: {
    backgroundColor: palette.coolGrey4,
    height: '4.5rem',
    margin: '1rem 0 0',
  },
})(FormControl);

export const StyledInputLabel = withStyles({
  root: {
    color: palette.midnightBlue,
    fontFamily: '"Montserrat", sans-serif',
    top: '50%',
    transform: 'translate(1rem, -50%) scale(1)',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
    width: '50%',
  },
  required: {
    '& > span': {
      color: palette.error,
    },
  },
  shrink: {
    color: palette.coolGrey1,
    top: '0%',
    transform: 'translate(1rem, 0.5rem)',
    transformOrigin: 'center left',
    transition: 'all 200ms cubic-bezier(0.0, 0, 0.2, 1)',
  },
  focused: {
    color: `${palette.coolGrey1} !important`,
  },
})(InputLabel);

export const StyledInputBase = withStyles({
  root: {
    fontFamily: '"Montserrat", sans-serif',
    height: '4rem',
    margin: 'auto 0',
  },
  input: {
    backgroundColor: 'transparent',
    border: 0,
    borderRadius: '0.25rem',
    boxShadow: 'none',
    color: palette.midnightBlue,
    height: '4rem',
    paddingBottom: 0,
    padding: '0.5rem 1rem',
    '&:focus': {
      backgroundColor: 'transparent',
      border: 0,
      boxShadow: 'none',
    },
    '&[disabled]': {
      backgroundColor: 'transparent',
      cursor: 'default',
    },
  },
})(InputBase);

export const MemberContainer = styled.div`
  height: 40px;
  width: 40px;
  z-index: ${props => props.zIndex ?? 1};
`;

export const MembersContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row-reverse nowrap;
  margin: 0 0.5rem;
  justify-content: flex-start;

  > ${MemberContainer}:not(:first-child) {
    width: 34px;
  }
`;

export const EmptyMember = styled(ButtonBase)`
  && {
    background-color: ${palette.white};
    border: 0.0625rem dashed ${palette.coolGrey1};
    border-radius: 50%;
    color: ${palette.oPlusRed};
    font-size: 1.5rem;
    height: 40px;
    width: 40px;
  }
`;

export const MoreMemberLabel = styled.div`
  align-items: center;
  background-color: ${palette.white};
  border: 0.0625rem solid ${palette.coolGrey1};
  border-radius: 50%;
  color: ${palette.coolGrey1};
  display: flex;
  font-size: 1rem;
  height: 40px;
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 40px;
`;

export const EmptyMemberIcon = styled.div`
  transform: rotate(${props => (props.rotated ? -45 : 0)}deg);
  transition: all 0.25s ease-out;
`;

export const InputFieldSpacer = styled.div`
  min-height: 1rem;
  height: 1rem;
  width: 100%;
`;

export const StyledCollapse = styled(Collapse)`
  && {
    margin: 0;
    width: 100%;
  }
`;

export const StyledListItem = styled(ListItem)`
  && {
    background-color: ${palette.coolGrey4};
    height: 4rem;
    width: 100%;

    &:hover {
      background-color: ${opacify(palette.coolGrey4, 0.5)};
    }
  }
`;

export const StyledList = styled(List)`
  && {
    margin: 0;
    max-height: 12rem;
    overflow-y: auto;
    padding: 0;
    width: 100%;

    &::-webkit-scrollbar {
      -webkit-appearance: none;
      background-color: ${palette.coolGrey2};
      padding: 1px;
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${opacify(palette.black, 0.5)};
      border-radius: 4px;
      -webkit-box-shadow: 0 0 1px ${opacify(palette.black, 0.5)};
      z-index: 100;
    }
  }
`;

export const StyledButton = withStyles({
  root: {
    minWidth: 'unset',
  },
  contained: {
    minWidth: '12rem',
  },
})(Button);

export const FormSpacing = styled.div`
  height: 2rem;
  width: 100%;
`;

export const FormDoubleSpacing = styled(FormSpacing)`
  height: 3rem;
`;

export const SearchFieldContainer = styled.div`
  height: 2.5rem;
  position: relative;
  width: 100%;
`;

export const SearchField = styled.input`
  background-color: ${palette.white};
  border: 0;
  color: ${palette.black};
  height: 100%;
  padding: 0.5rem;
  padding-left: 2rem;
  outline: none;
  width: 100%;
`;

export const SearchFieldIcon = styled.img.attrs({
  alt: 'Search icon',
  src: SearchIconImage,
})`
  height: 100%;
  left: 0.5rem;
  object-fit: contain;
  object-position: center;
  position: absolute;
  top: 0;
  width: 1rem;
  z-index: 1;
`;

export const FormIconContainer = styled.div`
  color: ${palette.coolGrey1};
`;

export const ExtendedFormControl = styled.div`
  align-items: center;
  background-color: ${palette.coolGrey4};
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr auto;
  min-height: 4.5rem;
  margin: 1rem 0 0;
  position: relative;
  width: 100%;

  & label {
    position: absolute;
  }
`;

export const MemberNamesLabelContainer = styled.div`
  padding-left: 1rem;
  padding-top: 1rem;
  white-space: normal;
`;

export const TickIconContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  min-width: 1rem;
  width: 1rem;

  & svg {
    object-fit: contain;
    width: 100%;
  }
`;

export const FullWidthInputContainer = styled.div`
  width: 100%;
`;
