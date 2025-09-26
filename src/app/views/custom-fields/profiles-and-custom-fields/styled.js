import { Button } from '@mui/material';
import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';
import AddIcon from '@mui/icons-material/Add';

export const ViewContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 0px;
  color: ${palette.mediumGrey};
  font-family: inherit;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  gap: 32px;
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
  border-radius: 4px;
  background: ${palette.newDarkBlue};
  color: ${palette.white};
  height: 32px;
  &:hover {
    background-color: ${palette.purpleNavy};
  }
`;

export const AddButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const PlusIcon = styled(AddIcon)`
  font-size: 20px;
`;
