import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Field from './Field';
import AddIcon from '@mui/icons-material/Add';

const fields = [
  {
    name: 'domainName',
    label: 'Domain Name',
    ellipsis: false,
  },
  {
    name: 'apiKey',
    label: 'API Key',
    ellipsis: true,
  },
  {
    name: 'clientId',
    label: 'Client Id',
    ellipsis: true,
  },
  {
    name: 'clientSecret',
    label: 'Client Secret',
    ellipsis: true,
  },
] as const;

const ApiKeySection = () => {
  const data = {
    domainName: 'dock.health-d5ed19ac-01ad-433d-bb61-046035a1df0b',
    apiKey: 'CehlWsU4KR3W7hE2yzVJy3FrUH2bsO5X5uFJLdTX',
    clientId: '11gogdqm4iqc42md4n2i4ki8gr',
    clientSecret: '1hm3imfccbionbt2mfjf6t2ni1faf7kqk3ivvsc315ipd0isi9lo',
  };

  const generateApiKey = () => {};

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Typography variant="h3">API Key</Typography>
          {!data && (
            <Button onClick={generateApiKey} startIcon={<AddIcon />}>
              Generate
            </Button>
          )}
        </Box>
        <Box sx={{ my: 3, mx: 2 }}>
          {fields.map((field) => (
            <Field
              key={field.name}
              label={field.label}
              ellipsis={field.ellipsis}
              value={data[field.name]}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ApiKeySection;
