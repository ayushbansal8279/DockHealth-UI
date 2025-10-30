import React, { useEffect, useState } from 'react';
import { Switch, TextField, Box } from '@mui/material';
import {
  Container,
  Description,
  InputRow,
  Section,
  Title,
  TitleWrapper,
  UpdateButton,
} from './styled';
import { organizationWorkspaceLabelSelector } from '@/app/selectors/organization-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrganizationWorkspaceLabel } from '@/app/actions/organization-actions';
import { userHasWorkspacesFeatureSelector } from '@/app/selectors/user-selectors';
import { useHistory } from 'react-router-dom';

const WorkspaceConfigure = () => {
  const history = useHistory();
  const [enabled, setEnabled] = useState(true);
  const dispatch = useDispatch();
  const workspaceLabel = useSelector(organizationWorkspaceLabelSelector);
  const [label, setLabel] = useState(workspaceLabel);

  const workspacesAvailable = useSelector(userHasWorkspacesFeatureSelector);
  if (!workspacesAvailable) {
    history.push(`/core/home`);
  }

  useEffect(() => {
    setLabel(workspaceLabel);
  }, [workspaceLabel]);

  const handleToggle = () => {
    setEnabled((prev) => !prev);
  };

  const handleLabelChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setLabel(e.target.value);
  };

  const handleLabelUpdate = async () => {
    dispatch(updateOrganizationWorkspaceLabel(label));
  };

  return (
    <Container>
      {/* <Section elevation={1}>
        <TitleWrapper>
          <Title>Enable Workspaces</Title>
          <Switch checked={enabled} onChange={handleToggle} />
        </TitleWrapper>
        <Description>
          Workspaces provides your organization with a structured way to manage
          teams, workflows, and patients (or clients) — driving collaboration
          while maintaining precise access control.
        </Description>
        <Box mt={2} />
      </Section> */}

      <Section elevation={1}>
        <TitleWrapper>
          <Title>Choose what to call your Workspaces</Title>
        </TitleWrapper>
        <Description>
          By default, we call them Workspaces, but you can customize the label
          to better fit your organization — for example, Department, Clinic, or
          any other term you prefer.
        </Description>
        <InputRow>
          <TextField
            value={label}
            onChange={handleLabelChange}
            variant="outlined"
            size="small"
            disabled={!enabled}
          />
          <UpdateButton
            variant="contained"
            color="primary"
            onClick={handleLabelUpdate}
            disabled={workspaceLabel === label || !enabled}
          >
            Update
          </UpdateButton>
        </InputRow>
      </Section>
    </Container>
  );
};

export default WorkspaceConfigure;
