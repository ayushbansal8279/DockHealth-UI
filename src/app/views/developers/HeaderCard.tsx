import React from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { Box, Card, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import Field from './Field';
import { useCreateCredential } from '@/app/react-query/developer-credentials/useCreateCredential';

const noCredentialHelperText =
  "No credentials exist. Please click 'Create credential' to get your first set.";

interface Props {
  credentialsExist: boolean;
}

export default function HeaderCard({ credentialsExist }: Props) {
  const { userIdentifier, organizationIdentifier } =
    useSelector(userProfileSelector);
  const createCredential = useCreateCredential({
    orgId: organizationIdentifier,
  });

  const fields = [
    {
      value: userIdentifier,
      label: 'User Identifier',
      ellipsis: false,
    },
    {
      value: organizationIdentifier,
      label: 'Organization Identifier',
      ellipsis: false,
    },
  ];

  const handleCreateCredentialClick = () => {
    createCredential.mutate();
  };

  return (
    <Card sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h3">Credentials</Typography>
        <LoadingButton
          onClick={handleCreateCredentialClick}
          variant="contained"
          startIcon={<AddIcon />}
          loading={createCredential.isPending}
        >
          Create Credential
        </LoadingButton>
      </Box>
      {credentialsExist ? (
        fields.map((field) => (
          <Field
            key={field.label}
            label={field.label}
            ellipsis={field.ellipsis}
            value={field.value}
          />
        ))
      ) : (
        <Typography>{noCredentialHelperText}</Typography>
      )}
    </Card>
  );
}
