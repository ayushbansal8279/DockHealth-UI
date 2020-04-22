import { Collapse } from '@material-ui/core';
import styled from 'styled-components';
import palette from 'app/palette';

export const CubesLoaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const BlockItemContainer = styled.div`
  align-items: center;
  display: flex;
  background-color: ${palette.white};
  border: 0.0625rem solid ${palette.coolGrey3};
  flex-direction: column;
  justify-content: space-between;
  min-height: 6rem;
  padding: 0.3rem 0.4rem;
  position: relative;
  text-align: center;

  && > * {
    padding: 0;
    margin: 0;
  }

  && > *:nth-child(odd) {
    margin: 0.25rem 0;
  }
`;

export const StyledCollapse = styled(Collapse)`
  width: 100%;
`;

export const TaskListViewWrapper = styled.div`
  display: flex;
  max-width: 100%;
  min-height: 100%;
  overflow: hidden;
  width: 100%;
`;

export const TopMessageContainer = styled.div`
  padding: 0.25rem 2rem;
  text-align: center;
`;

export const NoListsAvailableContainer = styled.div`
  align-content: center;
  align-items: center;
  display: grid;
  flex: 0.5;
  grid-gap: 1.25rem;
  grid-template-columns: auto;
  justify-content: center;
  justify-items: center;
`;

export const NoListsIconContainer = styled.div`
  align-items: center;
  border: 0.125rem solid #c1ccda;
  border-radius: 4rem;
  color: ${palette.oPlusRed};
  display: flex;
  height: 4rem;
  justify-content: center;
  min-height: 4rem;
  min-width: 4rem;
  width: 4rem;
`;

export const TaskListViewTipsContainer = styled.div`
  display: grid;
  padding: 2rem;
  grid-template-columns: 1fr 6rem 1fr 6rem 1fr;
  max-width: 1294px;
  min-width: 959px;
`;

export const TipsImage = styled.img`
  cursor: default;
  height: 10rem;
  justify-self: center;
  margin-bottom: 1rem;
  min-height: 10rem;
  object-fit: contain;
  width: 100%;
`;

export const TaskListTipTextContainer = styled.div`
  color: ${palette.white};
`;

export const TaskListTipSmallTextContainer = styled.div`
  font-size: 0.875rem;
`;

export const TaskListTipsFooterContainer = styled.div`
  cursor: pointer;
  font-size: 1.1875rem;
  text-align: right;
`;

export const TipsContainer = styled.div`
  position: relative;
  width: 100%;
`;
