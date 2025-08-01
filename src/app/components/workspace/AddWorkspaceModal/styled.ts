import { ModalWrapper } from "@/app/modal/components/styled";
import palette from "@/app/styles/palette";
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
  width: 100%;
  text-align: center;
`;

export const AddWorkspaceModalWrapper = styled(ModalWrapper)`
  align-items: flex-start;
  width: 643px;
  padding: 39px ${spacing.giga};
  color: ${palette.mediumGrey};
  font-family: 'Outfit', sans-serif;
  text-align: left;
`;