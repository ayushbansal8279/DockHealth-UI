import styled from 'styled-components';
import palette from 'styles/palette';

export const StatusWrapper = styled.div`
  display: flex;
`;

export const StatusBar = styled.div`
  background-color: ${(props) => props.color};
  height: calc(100% - 2px);
  top: 0;
  left: 0;
  position: absolute;
  width: 6px;
  top: 50%;
  transform: translateY(-50%);
`;

export const StatusName = styled.p`
  display: block;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 0;
  text-align: left;
`;

export const Placeholder = styled.div`
  width: 100%;
  color: ${palette.mediumGrey};
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 400;

  &:hover {
    color: ${palette.brightBlue};
  }
`;

export const AddPlaceholder = styled(Placeholder)`
  color: ${palette.lightGrey};
  opacity: 0;

  &::first-letter {
    color: ${palette.orange};
    font-size: 16px;
  }
`;
