import palette from '@/app/styles/palette';
import { Close } from '@mui/icons-material';
import styled from 'styled-components';

export const BuilderContainer = styled.div`
  max-width: 1000px;
  width: 100%;
`;

export const CategoryDropper = styled.div`
  border: 2px dashed ${palette.iron};
  margin: 30px 60px 0 80px;
  text-align: center;
  align-content: center;
  height: ${({ isAddCategoryDrop }) => (isAddCategoryDrop ? '100px' : '50px')};
  font-size: 14px;
  line-height: 17.64px;
  letter-spacing: 0.3px;
  color: ${palette.coolGrey1};
  border-radius: 4px;

  @media (max-width: 1920px) {
    margin: 30px 40px 0 40px;
  }

  @media (max-width: 1024px) {
    margin: 20px 20px 0 20px;
  }
`;

export const NewCategoryContainer = styled.div`
  padding: 10px 10px 10px 10px;
  margin: 30px 60px 0 80px;
  height: 78px;
  display: flex;
  align-items: center;
  color: ${palette.coolGrey1};
  border: 2px solid ${palette.iron};

  @media (max-width: 1920px) {
    margin: 30px 40px 0 40px;
  }

  @media (max-width: 1024px) {
    margin: 20px 20px 0 20px;
  }
`;

export const NewCategoryWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

export const CloseIcon = styled(Close)`
  cursor: pointer;
`;
