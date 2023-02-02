import styled from 'styled-components';
import spacing from 'styles/spacing';

export const ItemsList = styled.div`
  max-height: ${(props) => props.listMaxHeight};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: ${(props) =>
    props.withPadding ? `${spacing.large} ${spacing.largePlus}` : ''};
`;
