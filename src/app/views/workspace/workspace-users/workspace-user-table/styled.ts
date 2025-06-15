import palette from "@/app/styles/palette";
import styled from "styled-components";

export const BulkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  left: 24px;
`;

export const ListContainer = styled.div`
  background-color: ${palette.white};
  padding: 1rem;
`;

export const ListEntryContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  margin: 0 0.5rem;
  padding: 1rem 0.5rem;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.unknownGrey6};
  }
`;