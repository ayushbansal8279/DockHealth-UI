import palette from '@/app/styles/palette';
import { Delete } from '@mui/icons-material';
import styled from 'styled-components';

export const MainContainer = styled.div`
  margin: 10px 60px 0 80px;
  border: 2px solid ${palette.iron};
`;

export const CategoryHeader = styled.div`
  padding: 10px 20px 10px 20px;
  display: flex;
  height: 78px;
  justify-content: space-between;
  align-items: center;
  color: ${palette.coolGrey1};
  border-bottom: 1px solid ${palette.coolGrey1};
`;

export const HeaderWrapper = styled.div`
  width: 80%;
  display: flex;
  height: 78px;
  align-items: center;
  color: ${palette.coolGrey1};
  border-bottom: 1px solid ${palette.coolGrey1};
`;

export const FieldDropper = styled.div`
  border: 2px dashed ${palette.iron};
  margin: 16px;
  text-align: center;
  align-content: center;
  height: ${({ isAddFieldDrop }) => (isAddFieldDrop ? '100px' : '50px')};
  font-size: 14px;
  line-height: 17.64px;
  letter-spacing: 0.3px;
  color: ${palette.coolGrey1};
`;

export const DeletIcon = styled(Delete)`
  cursor: pointer;
`;
