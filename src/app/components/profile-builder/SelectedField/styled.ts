import palette from "@/app/styles/palette";
import styled from "styled-components";

export const FieldArea = styled.div`
  margin: 32px 16px;
  color: ${palette.coolGrey1};
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const FieldIconContainer = styled.div`
  width: 50px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  opacity: 0px;
  background: #f8f8f9;
`;