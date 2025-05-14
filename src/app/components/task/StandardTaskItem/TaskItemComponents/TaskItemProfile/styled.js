import { fontWeights } from "@/app/styles/font";
import palette from "@/app/styles/palette";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const ProfileLabel = styled.span`
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.light};
  font-size: 0.65 rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;

  &:hover {
    color: ${palette.brightBlue};
    text-decoration: underline;
  }
`;

export const StyledProfileLink = styled(Link)({
  color: palette.mediumGrey,
  fontFamily: 'Outfit',
  textDecoration: 'none',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  '&:hover': {
    color: palette.brightBlue,
  },
});