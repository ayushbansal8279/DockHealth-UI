import Card, { CardProps } from '@mui/material/Card';
import { styled } from '@mui/material/styles';

export const ContainerCard = styled(Card)<CardProps>(({ theme }) => ({
  width: '422px',
  outerWidth: '100%',
  overflow: 'scroll',
  borderRadius: theme.spacing(1),
  '& .fr-box': {
    // css customization of the react-froala-wysiwyg toolbar
    zIndex: 2000,
    '& .fr-toolbar .fr-command.fr-btn svg.fr-svg': {
      width: '16px',
      height: '16px',
      margin: '4px',
    },
  },
}));
