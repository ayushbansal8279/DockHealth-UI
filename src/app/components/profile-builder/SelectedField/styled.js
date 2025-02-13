import palette from "@/app/styles/palette";
import { Delete, Edit } from "@mui/icons-material";
import styled from "styled-components";

export const FieldArea = styled.div`
  margin: 32px 20px 32px 20px;
  color: ${palette.coolGrey1};
  display: flex;
  align-items: center;
  gap: 15px;
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

export const EditIcon = styled(Edit)`
  cursor: pointer;
`;

export const DeletIcon = styled(Delete)`
  cursor: pointer;
`;