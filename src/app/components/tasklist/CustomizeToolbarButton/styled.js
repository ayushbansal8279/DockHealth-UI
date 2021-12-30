import styled from 'styled-components';
import palette from 'styles/palette';

export const CustomizeButton = styled.button`
  display: flex;
  height: 46px;
  padding: 4px 12px;
  align-items: center;
  border-radius: 5px;
  color: ${palette.darkGrey};

  &:hover {
    background: ${palette.coolGrey3};
  }
`;

export const CustomizeImg = styled.img`
  width: 21px;
`;

export const PopoverContainer = styled.div`
  background-color: ${palette.white};
  width: 233px;
  box-shadow: 0px 4px 11px grey;
  max-height: 800px;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const PlusIcon = styled.div`
  padding: 0 2px;
`;

export const Spacer = styled.hr`
  margin: 0;
  width: 100%;
  border-color: ${palette.coolGrey3};
  height: 0.5px;
`;
