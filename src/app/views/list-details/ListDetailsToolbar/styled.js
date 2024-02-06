import { Box } from '@mui/material';
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const LabelBox = styled(Box)`
  cursor: pointer;
`;

export const ToolbarContainer = styled.div`
  background-color: ${palette.white};
  color: ${palette.coolGrey1};
  // position: sticky;
  // left: 0px;
  display: flex;
  // justify-content: space-between;
  // align-items: center;
  // z-index: 13;
  padding: ${spacing.small} ${spacing.large};

  @media print {
    display: none;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 40px 40px 40px;
  grid-template-rows: 37px;
  border: 2px solid ${palette.zinc};
  border-radius: 5px;
  z-index: 13;
  overflow: hidden;
  @media print {
    display: none;
  }
`;

export const GridItemCalendarView = styled.div`
  background-color: ${(props) =>
    props.active ? palette.newDarkBlue : palette.white};
  color: ${(props) => (props.active ? palette.white : palette.zinc)};
  height: 37px;
  text-align: center;
  border-right: 2px solid ${palette.zinc};
  cursor: pointer;
  @media print {
    display: none;
  }
`;

export const GridItemFullView = styled.div`
  background-color: ${(props) =>
    props.active ? palette.newDarkBlue : palette.white};
  color: ${(props) => (props.active ? palette.white : palette.zinc)};
  height: 37px;
  text-align: center;
  cursor: pointer;
  @media print {
    display: none;
  }
`;

export const GridItemSlimView = styled.div`
  background-color: ${(props) =>
    props.active ? palette.newDarkBlue : palette.white};
  color: ${(props) => (props.active ? palette.white : palette.zinc)};
  height: 37px;
  text-align: center;
  border-left: 2px solid ${palette.zinc};
  cursor: pointer;
  @media print {
    display: none;
  }
`;
