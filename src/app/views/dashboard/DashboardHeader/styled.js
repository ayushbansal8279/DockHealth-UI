import styled from 'styled-components';
import palette from 'styles/palette';

export const DashboardHeaderContainer = styled.div`
  @media print {
    display: none;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 42px 40px;
  grid-template-rows: 37px;
  border: 2px solid ${palette.zinc};
  border-radius: 5px;
  z-index: 13;
  margin-right: 10px;
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
  // border: 2px solid ${palette.zinc};
  cursor: pointer;
  @media print {
    display: none;
  }
`;

export const GridItemFullView = styled.div`
  background-color: ${(props) =>
    props.active ? palette.newDarkBlue : palette.white};
  color: ${(props) => (props.active ? palette.white : palette.zinc)};
  // border: 2px solid ${palette.zinc};
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
  // border-left: 2px solid ${palette.zinc};
  cursor: pointer;
  @media print {
    display: none;
  }
`;
