import React, { FC } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { useDeleteApiKey } from '@/app/react-query/developers/useDeleteApiKey';
import { useUpdateApiKey } from '@/app/react-query/developers/useUpdateApiKey';

interface DisplayApiKeyHeaderProps {
  organizationIdentifier: string;
}

const DisplayApiKeyHeader: FC<DisplayApiKeyHeaderProps> = ({
  organizationIdentifier,
}) => {
  const updateApiKey = useUpdateApiKey();
  const deleteApiKey = useDeleteApiKey();
  const isLoading = updateApiKey.isLoading || deleteApiKey.isLoading;

  const handleUpdate = () => {
    updateApiKey.mutate(organizationIdentifier);
  };

  const handleDelete = () => {
    deleteApiKey.mutate(organizationIdentifier);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="warning"
        startIcon={<EditIcon />}
        onClick={handleUpdate}
        disabled={isLoading}
      >
        {updateApiKey.isLoading ? 'Regnerating...' : 'Regenerate'}
      </Button>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleDelete}
        disabled={isLoading}
      >
        {deleteApiKey.isLoading ? 'Revoking...' : 'Revoke'}
      </Button>
    </>
  );
};

export default DisplayApiKeyHeader;
