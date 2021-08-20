import styled from 'styled-components';
import spacing from 'styles/spacing';
import Select from 'components/common/Select/Select';

// eslint-disable-next-line import/prefer-default-export
export const TaskTemplateViewContainer = styled.div`
  text-align: right;
  padding: ${spacing.giga} 42px;
`;

export const HeaderSelect = styled(Select)``;
export const HeaderSelectContainer = styled(HeaderSelect)`
  width: 200px;
`;
