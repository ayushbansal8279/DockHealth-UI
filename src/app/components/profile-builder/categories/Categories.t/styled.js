import palette from '@/app/styles/palette';
import spacing from '@/app/styles/spacing';
import styled from 'styled-components';

export const CategoryContainer = styled.div`
  padding: ${spacing.regularPlus};
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
`;
export const CategoryLabel = styled.div`
  font-weight: 500;
  line-height: 20.16px;
  text-align: center;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 48%;
  color: ${palette.coolGrey1};
  height: 74px;
  border: 2px solid ${palette.iron};
`;

export const IconContainer = styled.img`
  width: 20px;
  height: 33px;
  margin-bottom: 5px;
`;

export const ExistingFieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

export const ExistingField = styled.div`
  padding: 0 10px;
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  width: 48%;
  color: ${palette.coolGrey1};
  height: 44px;
  border: 2px solid ${palette.iron};
`;

export const CategoryLabelExisting = styled.div`
  font-weight: 500;
  line-height: 20.16px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 70%;
`;
