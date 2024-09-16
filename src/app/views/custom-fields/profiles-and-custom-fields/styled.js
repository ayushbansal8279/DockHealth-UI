import { Button } from '@mui/material';
import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';
import AddIcon from '@mui/icons-material/Add';

export const ViewContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 50px 20px;
  color: ${palette.mediumGrey};
  font-family: inherit;
`;

export const AddTemplateWrapper = styled.div`
  text-transform: none;
  color: ${palette.mediumGrey};

  &:before {
    position: absolute;
    top: 50%;
    left: -8px;
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.orange};
    font-size: ${fontSizes.regular};
  }
`;

export const AddButton = styled(Button)`
  margin-top: 10px;
  border-radius: 6px;
  background: ${palette.newDarkBlue};
  color: ${palette.white};
  height: 32px;
  &:hover {
    background-color: ${palette.purpleNavy};
  }
`;

export const AddButtonWrapper = styled.div`
  position: absolute;
  right: 100px;
`;

export const PlusIcon = styled(AddIcon)`
  font-size: 20px;
`;
