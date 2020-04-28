import styled from 'styled-components';
import { Collapse, List, ListItem, ButtonBase } from '@material-ui/core';
import palette, { opacify } from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const PeoplePickerBox = styled.div`
  background-color: ${palette.coolGrey4};
  display: flex;
  flex-direction: column;
  padding: ${spacing.regular} ${spacing.small};
  position: relative;
  width: 100%;
`;

export const SelectedPeople = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 0.5rem;
`;

export const SelectedPeopleIcons = styled.div`
  align-items: center;
  align-self: flex-end;
  display: flex;
  justify-self: flex-end;
  margin: 0 0.5rem;
`;

export const SelectedPeopleNames = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PeopleLabel = styled.div`
  color: ${props => props.hasSelectedPeople && palette.lightGray};
  font-size: ${props =>
    props.hasSelectedPeople ? fontSizes.smallPlus : fontSizes.regular};
  left: ${props => (props.hasSelectedPeople ? spacing.regular : 0)};
  position: ${props => (props.hasSelectedPeople ? 'absolute' : 'initial')};
  transition: font-size 0.2s, position 0.2s;
  top: ${props => (props.hasSelectedPeople ? spacing.small : 0)};

  *:nth-child(1) {
    margin-left: ${spacing.tiny};
  }
`;

export const PeopleListBox = styled(Collapse)`
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17); // per design
  padding: ${props => (props.in ? spacing.small : 0)};

  && {
    margin: 0;
    width: 100%;
  }
`;

export const PeopleList = styled(List)`
  && {
    margin: 0;
    max-height: 12rem;
    overflow-y: auto;
    padding: 0;
    width: 100%;

    &::-webkit-scrollbar {
      -webkit-appearance: none;
      background-color: ${palette.coolGrey2};
      width: ${spacing.tiny};
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${opacify(palette.black, 0.5)};
      border-radius: 4px;
      -webkit-box-shadow: 0 0 1px ${opacify(palette.black, 0.5)};
      z-index: 100;
    }
  }
`;

export const PeopleListItem = styled(ListItem)`
  && {
    padding: ${spacing.small} ${spacing.small} ${spacing.small}
      ${spacing.regularPlus};
    width: 100%;

    &:hover {
      background-color: #f5f8fa;
    }
  }
`;

export const PeopleName = styled.span`
  margin-left: ${spacing.smallPlus};
`;

export const PeopleNames = styled.div`
  margin-top: ${spacing.smallPlus};
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.bold};
`;

export const PeopleCrossIcon = styled.img`
  transform: rotate(${props => (props.rotated ? -45 : 0)}deg);
  transition: all 0.25s ease-out;
`;

export const EmptyPeople = styled(ButtonBase)`
  && {
    border: 0.0625rem dashed ${palette.coolGrey1};
    border-radius: 50%;
    color: ${palette.blueOcean};
    width: 38px;
  }
`;

export const MorePeopleLabel = styled.div`
  align-items: center;
  background-color: ${palette.white};
  border: 0.0625rem solid ${palette.coolGrey1};
  border-radius: 50%;
  color: ${palette.coolGrey1};
  display: flex;
  font-size: 1rem;
  height: 38px;
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 38px;
`;
