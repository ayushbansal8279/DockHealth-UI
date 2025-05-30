import styled from "styled-components";

import palette from "@/app/styles/palette";

export const UserListWrapper = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  &::-webkit-scrollbar:vertical {
    width: 11px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${palette.white};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid ${palette.white};
    background-color: ${palette.coolGrey1};
  }
`;

export const IconContainer = styled.img`
  transform: rotate(90deg);
  margin:5px;
`