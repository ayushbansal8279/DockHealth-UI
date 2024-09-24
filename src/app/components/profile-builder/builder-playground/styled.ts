import palette from '@/app/styles/palette';
import styled from 'styled-components';

interface CategoryDropperProp {
  isAddCategoryDrop: boolean;
}
export const CategoryDropper = styled.div`
  border: 2px dashed ${palette.iron};
  margin: 30px 60px 0 80px;
  text-align: center;
  align-content: center;
  height: ${({ isAddCategoryDrop }: CategoryDropperProp) =>
    isAddCategoryDrop ? '100px' : '50px'};
  font-size: 14px;
  line-height: 17.64px;
  letter-spacing: 0.3px;
  color: ${palette.coolGrey1};
`;

export const NewCategoryContainer = styled.div`
  padding: 10px 10px 10px 10px;
  margin: 30px 60px 0 80px;
  height: 78px;
  display: flex;
  align-items: center;
  color: ${palette.coolGrey1};
  border: 2px solid ${palette.iron};
`;
export const NewCategoryWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;
