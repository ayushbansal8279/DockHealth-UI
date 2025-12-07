import palette from '@/app/styles/palette';
import { Delete, Edit } from '@mui/icons-material';
import styled from 'styled-components';

export const FieldArea = styled.div`
  padding: 20px 20px 2px 20px;
  color: ${palette.coolGrey1};
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const FieldIconContainer = styled.div`
  width: 50px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  opacity: 0px;
  background: ${palette.whiteSmoke};
`;

export const EditIcon = styled(Edit)`
  cursor: pointer;
`;

export const DeletIcon = styled(Delete)`
  cursor: pointer;
`;

export const IconWrapper = styled.div`
  width: 30px;
`;
