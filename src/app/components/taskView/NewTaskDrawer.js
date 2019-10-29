import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core/es';

const NewTaskDrawerContainer = styled.div`
  align-items: flex-start;
  background-color: #fff;
  display: flex;
  height: 100%;
  min-height: calc(100vh - 88px - ${props => props.headsUpAreaHeight}px);
  justify-content: flex-start;
  padding: 4px;
  position: absolute;
  right: 0;
  transition: all 0.25s ease-out;
  top: 0;
  transform: translateX(100%);
  width: 30%;
  z-index: 1;

  ${props =>
    props.addingNewTask &&
    `
    transform: translateX(0%);
    right: 9px;
  `}
`;

const TopLabel = styled.div`
  color: #000;
  font-size: 24px;
  line-height: 44px;
  margin-bottom: 5px;
  padding-left: 20px;
  padding-top: 15px;
`;

const FormSection = styled(Grid)`
  border: 2px solid #ddf2f7;
  margin-top: 5px;
`;

export default ({ addingNewTask, headsUpAreaHeight }) => (
  <NewTaskDrawerContainer
    addingNewTask={addingNewTask}
    headsUpAreaHeight={headsUpAreaHeight}
  >
    <Grid container>
      <Grid item xs={12}>
        <TopLabel>Add a task</TopLabel>
      </Grid>
      <FormSection container item xs={12}>
        <Grid item xs={12}>
          <div style={{ padding: 8 }}>New task form placeholder</div>
        </Grid>
      </FormSection>
    </Grid>
  </NewTaskDrawerContainer>
);
