import palette from '@/app/styles/palette';
import spacing from '@/app/styles/spacing';
import styled from 'styled-components';

export const CategoryContainer = styled.div`
  position: fixed;
  padding: ${spacing.regularPlus};
  padding-right: ${spacing.huge};
  border-left: 1px solid ${palette.iron};
  height: 100%;
  overflow: auto;
`;

export const AddCategory = styled.div`
  border: 2px dashed ${palette.iron};
  border-radius: 6px;
  height: 52px;
  text-align: center;
  align-content: center;
  color: ${palette.coolGrey1};
  font-weight: 500;
  line-height: 20.16px;
  background-color: ${palette.whiteSmoke};
`;

export const CategoryTitle = styled.div`
  padding-bottom: 10px;
  font-size: 18px;
  line-height: 21.09px;
`;

export const SingleFieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

export const SingleField = styled.div`
  padding: 0 15px;
  display: flex;
  gap: 20px;
  align-items: center;
  width: 48%;
  color: ${palette.coolGrey1};
  height: 44px;
  border: 2px solid ${palette.iron};
  background-color: ${palette.whiteSmoke};
  border-radius: 4px;
`;

export const CategoryLabel = styled.div`
  font-weight: 500;
  line-height: 20.16px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 70%;
`;
