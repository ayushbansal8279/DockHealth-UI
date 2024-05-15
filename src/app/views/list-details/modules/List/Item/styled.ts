import styled from "@mui/styled-engine"


export const Item = styled("div")`
  display: flex;
  font-size: 13px;
  line-height: 40px;
  height: 40px;
  //margin: 0 64px 4px 64px;
  border-left: 1px solid rgb(229, 233, 242);
  ${({ $subitem }: any) => 
          $subitem 
                  ? `margin-left: 104px;` 
                  : ""
  }}
`