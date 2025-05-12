import { ModalWrapper } from "@/app/modal/components/styled";
import spacing from "@/app/styles/spacing";
import styled from "styled-components";

export const InputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    height: '50px',
    '&.Mui-focused fieldset': {
      borderColor: 'black',
      borderWidth: '1px',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'grey',
  },
};


export const Title = styled.h4`
  font-weight: 500;
`;

export const AddWorkspaceModalWrapper = styled(ModalWrapper)`
  padding: ${spacing.huge} ${spacing.largePlus};
  border-radius: 10px;
`;