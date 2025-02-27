import { fontSizes, fontWeights } from "@/app/styles/font";
import { CloseIconButton, ModalWrapperWithPadding } from "@/app/modal/components/styled";
import palette from "@/app/styles/palette";
import spacing from "@/app/styles/spacing";
import styled from "styled-components";

export const Row = styled.button`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${spacing.smallPlus};
  cursor: pointer;
  color: ${palette.coolGrey1};
  font-family: inherit;

  &:not(:last-of-type) {
    margin-bottom: ${spacing.tiny};
  }

  &:hover {
    background-color: rgba(193, 204, 218, 0.25);
  }
`;

export const InputBox = styled.div`
  display: flex;
  align-items: baseline;
  width: 100%;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  font-family: inherit;
  border-block-end: 1px solid ${palette.softSteelBlue};
  padding-inline: ${spacing.smallPlus};

  &:placeholder {
    color: ${palette.coolGrey2};
  }
`;

export const Input = styled.input`
  border: none;
  width: 100%;
  outline: none;
  padding: ${spacing.smallPlus};
  margin: 0;
`;

export const SearchProfilesResultList = styled.div`
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  height: 250px;
`

export const NoResultText = styled.div`
  padding: ${spacing.smallPlus};
  color: ${palette.coolGrey1};
`