import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const AvatarLoader = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${palette.skeletonLoader};
`;

export const LoaderText = styled.div`
  height: 19px;
  width: ${({ width }) => (width ? `${width}px` : '118px')};
  background-color: ${palette.skeletonLoader};

  &:not(:last-of-type) {
    margin-right: ${spacing.smallExtraPlus};
  }
`;
