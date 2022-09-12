import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

const TaskItemCell = styled.div`
  ${({ order }) => (order ? `order: ${order};` : '')}
  position: relative;
  width: ${props => (!props.width ? '100%' : '')};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${({ alignItems }) => alignItems || 'center'};
  border-right: 1px solid ${palette.coolGrey3};
  color: ${props => props.color || palette.mediumGrey};
  display: flex;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${props =>
    props.bolded ? fontWeights.regular : fontWeights.light};
  color: ${palette.mediumGrey};
  min-width: ${props => props.width}px;
  max-width: ${props => props.width}px;
  padding: ${props => props.padding || `${spacing.tiny} 0`};
  padding-left: ${props =>
    props.paddingLeft ? spacing[props.paddingLeft] : spacing.regular};
  padding-right: ${props =>
    props.paddingLeft ? spacing[props.paddingRight] : spacing.regular};
  overflow: hidden;

  @media print {
    ${({ printWidth }) =>
      printWidth &&
      `
      width: ${printWidth}px;
      min-width: ${printWidth}px;
      max-width: ${printWidth}px;
    `};
    border-right: 1px solid ${palette.coolGrey1};
  }
`;

export default TaskItemCell;
