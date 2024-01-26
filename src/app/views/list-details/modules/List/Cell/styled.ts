import styled from "@mui/styled-engine"


export const Cell = styled("div")`
  display: block;
  flex: 0 0 180px;
  order: ${({ $order }: any) => $order};
  min-width: 80px;
  height: 100%;
  padding: 0 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: white;
  border: 1px solid rgb(229, 233, 242);
  border-left: none;
`