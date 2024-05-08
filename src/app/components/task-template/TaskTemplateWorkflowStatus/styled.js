import styled from 'styled-components';
import palette from 'styles/palette';

export const StatusSubContaioner = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 12px;
`;

export const StatusWrapper = styled.div`
  display: flex;
  border-radius: 2px;
  border: 1px solid ${(property) => property.color || '#7F4334'};
  background: ${(property) => `${property.color}1A` || '#7F43341A'};
  min-width: 90px;
  padding: 2.5px 2px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: ${(property) => property.color || '#7F4334'};
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
  text-align: center;
  font-family: Outfit;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
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
    // opacity: 100;
  }
`;

export const AddPlaceholder = styled(Placeholder)`
  color: ${palette.lightGrey};
  opacity: 0;

  // &::first-letter {
  //   color: ${palette.orange};
  //   font-size: 16px;
  // }
`;
