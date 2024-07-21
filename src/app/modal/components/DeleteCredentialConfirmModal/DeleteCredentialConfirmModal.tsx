import React from 'react';
import { Typography } from '@mui/material';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import { formatEllipsisText } from '@/app/helpers/formatters';

interface Props {
  apiKey: string;
  closeModal: VoidFunction;
  confirm: VoidFunction;
}

export default function DeleteCredentialConfirmModal({
  apiKey,
  ...restProps
}: Props) {
  const title = 'Delete Credential Keys';
  const description = (
    <>
      <Typography sx={{ fontWeight: 'bold' }}>
        {formatEllipsisText(apiKey)}
      </Typography>
      <Typography>
        This action cannot be undone and these keys will no longer be active
      </Typography>
    </>
  );

  return (
    <DeleteConfirmationModal
      title={title}
      description={description}
      {...restProps}
    />
  );
}
