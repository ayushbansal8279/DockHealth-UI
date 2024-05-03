import React, { FC } from 'react';
import { Button } from '@mui/material';
import { useCreateApiKey } from 'react-query/developers/useCreateApiKey';
import AddIcon from '@mui/icons-material/Add';

interface CreateApiKeyHeaderProps {
  organizationIdentifier: string;
}

const CreateApiKeyHeader: FC<CreateApiKeyHeaderProps> = ({
  organizationIdentifier,
}) => {
  const createApiKey = useCreateApiKey({ orgId: organizationIdentifier });

  const handleCreateApiKey = () => {
    createApiKey.mutate();
  };

  return (
    <>
      <Button
        onClick={handleCreateApiKey}
        variant="outlined"
        startIcon={<AddIcon />}
        disabled={createApiKey.isPending}
      >
        {createApiKey.isPending ? 'Creating...' : 'Create API Key'}
      </Button>
    </>
  );
};

export default CreateApiKeyHeader;
