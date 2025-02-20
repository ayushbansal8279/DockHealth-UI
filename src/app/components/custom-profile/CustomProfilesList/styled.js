import { Link } from "@mui/material";
import styled from "styled-components";
import palette from 'styles/palette';

export const StyledLink = styled(Link)`
  color: ${palette.blueOcean};
  font-family: "Outfit", sans-serif;
  text-decoration: none;
  z-index: 1000;

  &:hover {
    color: ${palette.brightBlue};
  }
`;