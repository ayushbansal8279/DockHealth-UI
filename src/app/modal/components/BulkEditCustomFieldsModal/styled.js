import palette from "@/app/styles/palette";
import styled from "styled-components";

export const FilterOptionsList = styled.div`
  width: 257px;
  max-height: 600;
  overflow-y: auto;
  margin-top: 5px;
  margin-bottom: 5px;

  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: white;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${palette.coolGrey3};
    border-radius: 17px;
  }
`;

export const FilterOptionsListContainer = styled.div`
  width: 257px;
`;

export const SelectOptionsContainer = styled.div``;