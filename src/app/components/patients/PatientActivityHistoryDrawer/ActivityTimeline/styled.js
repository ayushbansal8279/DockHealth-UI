import { fontSizes, fontWeights } from "@/app/styles/font";
import palette, { opacify } from "@/app/styles/palette";
import spacing from "@/app/styles/spacing";
import { TimelineConnector, TimelineDot, TimelineOppositeContent } from "@mui/lab";
import { Card, Icon, IconButton, Typography } from "@mui/material";
import styled from "styled-components";


export const TitleName = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-family: 'Outfit', sans-serif;
  // text-transform: uppercase;
  padding: 5px 0 5px 10px;
`;

export const DateAndTime = styled(Typography).attrs({
    variant: "caption",
    color: "textSecondary",
  })`
    display: block;
  `;
  

export const TimelineLeftSideContent = styled(TimelineOppositeContent)`
  flex: 0.23;
  text-align: right;
  padding: 3px 8px 5px 5px;
  align-self: top;
`;


export const FilterIcons = styled(IconButton)`
  && {
    background-color: ${({ selected }) => (selected ? palette.brightBlue : "#f5f5f5")};
    color: ${({ selected }) => (selected ? "#fff" : "#616161")};
    border-radius: 50%;
    transition: 0.3s;

    &:hover {
      ${({ selected }) => !selected && `color: ${palette.brightBlue};`}
    }
  }
`;

export const ActivityWrapper = styled(Card).attrs({
    variant: 'outlined'
})`
  alignSelf: 'top',
  borderRadius: 2, 
  boxShadow: 'none',
  borderColor: '#e0e0e0',
  mb: 2
`;

export const ActivityName =  styled.p`
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  font-family: 'Outfit', sans-serif;
   margin: 0;
`;

export const ActivityDescription =  styled(Typography).attrs({
    variant: "caption",
    color: "textSecondary",
  })`
  font-size: ${fontSizes.smallPlus};
  font-family: 'Outfit', sans-serif;
`;

export const TimelineCenterIcon = styled(TimelineDot)`
  boxShadow: none;
  margin: 0;
`;

export const TimelineCenterLine = styled(TimelineConnector)`
  backgroundColor: #e0e0e0;
  height: 100%;
`;

export const Container = styled.a`
  align-items: center;
  border: 1px solid ${palette.coolGrey1};
  border-radius: 3px;
  color: ${palette.darkGrey};
  display: inline-flex;
  flex-flow: row nowrap;
  height: 2rem;
  padding: ${spacing.tiny} ${spacing.small};
  margin: ${spacing.tiny};
  max-width: 196px; // per design
  transition: all 0.25s ease-out;

  &:hover {
    
    color: ${palette.darkGrey};
  }
`;