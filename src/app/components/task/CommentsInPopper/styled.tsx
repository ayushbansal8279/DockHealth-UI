import Card, { CardProps } from '@mui/material/Card';
import { styled } from '@mui/material/styles';

export const ContainerCard = styled(Card)<CardProps>(({ theme }) => ({
  outerWidth: '422px',
  overflow: 'scroll',
  borderRadius: theme.spacing(1),
  '& .fr-box': {
    zIndex: 2000,
    '& .fr-toolbar .fr-command.fr-btn svg.fr-svg': {
      width: '16px',
      height: '16px',
      margin: '4px',
    },
  },
}));
