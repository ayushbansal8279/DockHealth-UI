import { ButtonBase, Grid } from '@material-ui/core';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import palette, { opacify } from 'app/palette';

export const FadeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

export const TaskListContainer = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column wrap;
  min-width: 569px;
`;

export const StyledButton = styled(ButtonBase)`
  && {
    display: flex;
    margin: 2rem auto;
    background: ${palette.lighterCyanBlue};
    border-radius: 1rem;
    height: 2rem;
    padding: 0.5rem 2.25rem;
    font-size: 0.875rem;
    color: ${palette.white};
  }
`;
export const StyledButtonLabel = styled.div`
  && {
    display: flex;
    margin: 2rem auto;
    background: ${palette.lighterCyanBlue};
    border-radius: 1rem;
    height: 2rem;
    padding: 0.25rem 2.25rem;
    font-size: 0.875rem;
    color: ${palette.white};
  }
`;

export const TaskViewGrid = styled(Grid)`
  && {
    width: 1050px;
    position: relative;
  }
`;

export const ToolbarContainer = styled.div`
  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
`;

export const TaskViewContainer = styled.div`
  max-width: 1050px;
  width: 1050px;
  width: -webkit-fill-available;
  width: -moz-available;
`;

export const FilterByTextContainer = styled(motion.div)`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  padding: 0 0.625rem 0.625rem;

  > *:not(:last-child) {
    margin-right: 0.25rem;
  }
`;

export const FilterByLabel = styled.div`
  color: ${palette.unknownGrey7};
  font-size: 0.875rem;
`;

export const FilterByBoldLabel = styled(FilterByLabel)`
  font-weight: bold;
`;

export const SideClickListener = styled.div`
  flex: 1;
  ${props => props.heightMax && 'height: 100%;'}
`;

export const CompletedButtonRowContainer = styled.div`
  align-items: center;
  display: flex;
  height: 70px;
  flex-direction: row wrap;
  justify-content: center;
`;

export const TaskListContainerWrapper = styled.div`
  flex: 2;
  padding: 4px;
`;

export const TaskListHeader = styled.div`
  display: flex;
  position: relative;
  height: 67px;
  background: ${palette.veryDarkBlue};
  box-shadow: 0 4px 4px 0 ${opacify(palette.black, 0.24)},
    0 0 4px 0 ${opacify(palette.black, 0.12)};
  color: ${palette.white};
  font-size: 1.5rem;
  font-weight: bold;
  padding: 15px 13.5px 19px 27px;
`;

export const TaskListSectionContainer = styled.div`
  margin-bottom: 1.5rem;
`;

export const TaskListSectionHeader = styled(Grid)`
  background-color: ${palette.white};
  margin-bottom: 0.25rem;
  padding: 0.25rem 0.75rem;
`;

export const TasklistCount = styled.div`
  color: ${palette.greyBlue};
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 0.5rem;
`;

export const TipsContainer = styled.div`
  position: relative;
  width: 100%;
`;
