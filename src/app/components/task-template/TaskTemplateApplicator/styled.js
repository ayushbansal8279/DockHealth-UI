import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';
import { LoaderFillElement } from 'components/task/TasksSkeletonLoader/styled';

export const TaskTemplateApplicatorContainer = styled.div`
  display: flex;
  padding: ${spacing.small} 0 ${spacing.small} ${spacing.regular};
  background-color: white;
  border: 1px solid ${palette.coolGrey3};
  margin-bottom: ${spacing.small};
  font-size: ${fontSizes.smallPlus};
  color: ${palette.mediumGrey};
`;

export const TaskTemplateApplicatorLabel = styled.span`
  white-space: nowrap;
  cursor: pointer;
`;

export const CreateTaskLinkText = styled.span`
  color: ${palette.mediumGrey};

  &:before {
    position: absolute;
    top: 50%;
    left: ${spacing.regularPlus};
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.orange};
    font-size: ${fontSizes.regular};
  }
`;

export const CreateTaskLinkContainer = styled.div`
  background-color: ${palette.coolGrey4};
  padding: 8px 20px 8px 32px;
  position: relative;
`;

export const Item = styled.div`
  width: 100%;
  padding: ${spacing.smallPlus} ${spacing.regularPlus};
  text-align: left;
  cursor: pointer;
  color: ${({ color }) => color || palette.mediumGrey};
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: ${palette.brightBlueWithAlpha};
  }
`;

export const EmptyLabel = styled.div`
  padding: ${spacing.regular} ${spacing.large};
  color: ${palette.mediumGrey};
`;

export const LoaderItem = styled(LoaderFillElement)`
  margin: ${spacing.regular} ${spacing.large};
`;

export const LoaderContainer = styled.div`
  padding: ${spacing.smallPlus} 0;
`;
