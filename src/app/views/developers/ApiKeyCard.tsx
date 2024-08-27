import React from 'react';
import { Credential } from '@/app/types/developer';
import { Box, Button, Card, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import Field from './Field';
import { openModal, closeModal } from '@/app/modal/actions';
import { useDispatch } from 'react-redux';
import { useDeleteCredential } from '@/app/react-query/developer-credentials/useDeleteCredential';

interface Props {
  data: Credential;
  idx: number;
}

export default function ApiKeyCard({ data, idx }: Props) {
  const { organizationIdentifier } = useSelector(userProfileSelector);

  const deleteCredential = useDeleteCredential();
  const dispatch = useDispatch();
  const fields = [
    {
      value: data.domain,
      label: 'Domain Name',
      ellipsis: false,
    },
    {
      value: data.apiKey,
      label: 'API Key',
      ellipsis: true,
    },
    {
      value: data.clientId,
      label: 'Client Id',
      ellipsis: true,
    },
    {
      value: data.clientSecret,
      label: 'Client Secret',
      ellipsis: true,
    },
  ];

  const handleDeleteClick = () => {
    const modalProps = {
      apiKey: data.apiKey,
      confirm: () => {
        // todo: delete api
        deleteCredential.mutate({
          orgId: organizationIdentifier,
          orgDeveloperIdentifier: data.orgDeveloperIdentifier,
        });
        dispatch(closeModal());
      },
    };
    dispatch(openModal('DeleteCredentialConfirm', modalProps));
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
        <Typography variant="h3">Key #{idx + 1}</Typography>
        <Button variant="outlined" color="error" onClick={handleDeleteClick}>
          Delete key
        </Button>
      </Box>
      {fields.map((field) => (
        <Field
          key={field.label}
          label={field.label}
          ellipsis={field.ellipsis}
          value={field.value}
        />
      ))}
    </Card>
  );
}
