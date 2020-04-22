import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';

export const HeadsUpSectionGrid = styled(Grid)`
  padding: 0.625rem 0 0.625rem 0.625rem;

  &:last-child {
    padding-right: 0.625rem;
  }
`;

export const HeadsUpSectionContainer = styled.div`
  border-radius: 4px;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 170px;
`;

export const HeadsUpSectionHeader = styled.div`
  align-items: center;
  color: ${palette.greyBlue};
  display: flex;
  font-size: 20px;
  font-weight: 800;
  padding: 5px 10px;
  text-transform: uppercase;
`;

export const HeadsUpSectionDivider = styled.div`
  background-color: ${opacify(palette.unknownGrey6, 0.5)};
  height: 1px;
  margin: 0 0.375rem;
`;

export const HeadsUpSectionHeaderButton = styled.div`
  color: ${props => (props.active ? palette.brightBlue : palette.mediumGrey)};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: normal;
  margin: 0 1rem;
  padding: 0.25rem;
  position: relative;
  transition: all 0.25s ease-out;
`;

export const HeadsUpButtonsContainer = styled.div`
  align-items: center;
  display: grid;
  flex: 1;
  grid-template-columns: repeat(${props => props.elementsCount ?? 1}, 1fr);
  grid-gap: 1rem;
  height: 7.9375rem;
  padding: 1rem;
  white-space: nowrap;
`;

export const HeadsUpSectionButton = styled.div`
  align-items: center;
  background-color: ${opacify(palette.white, 0.5)};
  border: 0.0625rem solid ${opacify(palette.coolGrey3, 0.5)};
  border-radius: 0.25rem;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  transition: all 0.25s ease-out;

  ${props =>
    props.active &&
    `background-color: ${palette.white}; border: 0.125rem solid ${palette.brightBlue};`}
`;

export const HeadsUpSectionButtonCount = styled.div`
  color: ${props => (props.active ? palette.brightBlue : palette.mediumGrey)};
  font-size: 3rem;
  font-weight: 900;
  pointer-events: none;
  transition: all 0.25s ease-out;
`;

export const HeadsUpSectionButtonLabel = styled.div`
  align-items: center;
  color: ${props => (props.active ? palette.brightBlue : palette.coolGrey1)};
  display: flex;
  font-size: 0.875rem;
  height: 2rem;
  justify-content: center;
  line-height: 1.2;
  margin-top: -10px;
  overflow: hidden;
  padding: 0 0.5rem;
  pointer-events: none;
  text-align: center;
  text-transform: uppercase;
  transition: all 0.25s ease-out;
  white-space: normal;
  width: 100%;
`;

export const HeadsUpChartContainer = styled(HeadsUpButtonsContainer)`
  padding: 0;
`;

export const HeadsUpSectionLabelOuterContainer = styled.div`
  overflow: hidden;
  width: 100%;
`;

export const HeadsUpSectionLabelInnerContainer = styled.div`
  display: flex;
  justify-content: center;

  ${props =>
    props.animated &&
    `animation-duration: 3s;
    `}
`;

export const HeadsUpAreaContainer = styled.div`
  width: 1050px;
`;
