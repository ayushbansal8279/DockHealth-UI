import { fontWeights } from "@/app/styles/font";
import palette from "@/app/styles/palette";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const BulkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  left: 24px;
`;

export const StyledListLink = styled(Link)({
  color: palette.brightBlue,
  fontFamily: 'Outfit',
  overflow: 'hidden',
  fontWeight: fontWeights.light,
  fontSize: '0.65 rem',
  textDecoration: 'underline',
});

export const AssignMemberIconContainer = styled.div`
  cursor: pointer;
  padding-left: 4px;
`;