import palette from '@/app/styles/palette';
import spacing from '@/app/styles/spacing';
import styled from 'styled-components';

export const CategoryContainer = styled.div`
  position: fixed;
  border-left: 1px solid ${palette.iron};
  height: 100%;
`;

export const CategoryWrapper = styled.div`
  padding: ${spacing.regularPlus};
  padding-right: ${spacing.huge};
  height: 85%;
  overflow-y: ${({ isDragging }) => (isDragging ? 'hidden' : 'auto')};
  overflow-x: hidden;
  margin-right: 15px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 1920px) {
    padding-right: ${spacing.regularPlus};
  }

  @media (max-width: 1024px) {
    padding: ${spacing.regular};
    margin-right: 10px;
  }
`;

export const AddCategoryWrapper = styled.div`
  border: 2px dashed ${palette.iron};
  border-radius: 6px;
  height: 48px;
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

  @media (max-width: 1024px) {
    width: 100%;
  }

  @media (min-width: 1025px) and (max-width: 1920px) {
    width: 48%;
  }
`;

export const CategoryLabel = styled.div`
  font-weight: 500;
  line-height: 20.16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 70%;
`;

export const ExistingFieldsSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const ExistingFieldsContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const ExistingFieldsList = styled.div`
  flex: 1;
  overflow: hidden;
  min-height: 0;
  padding-right: 8px;
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: ${palette.coolGrey1};
  min-height: 200px;
`;

export const EmptyStateMessage = styled.div`
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 8px;
`;

export const EmptyStateHint = styled.div`
  font-size: 12px;
  color: ${palette.coolGrey1};
  opacity: 0.8;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${palette.iron};
  flex-shrink: 0;
  gap: 16px;

  @media (max-width: 1024px) {
    gap: 12px;
    flex-wrap: wrap;
  }
`;

export const SearchFieldWrapper = styled.div`
  width: 48%;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;
