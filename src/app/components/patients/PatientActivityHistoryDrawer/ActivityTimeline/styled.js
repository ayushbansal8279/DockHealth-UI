import { fontSizes, fontWeights } from "@/app/styles/font";
import palette from "@/app/styles/palette";
import spacing from "@/app/styles/spacing";
import { TimelineConnector, TimelineDot, TimelineOppositeContent } from "@mui/lab";
import { Box, Card, IconButton, Typography } from "@mui/material";
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
  
  display: flex;
  flex-direction: column;
  gap: 2px;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 270px;
    display: block;
  }

  p {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 270px;
    display: block;
      
  }
`;

export const TimelineCenterIcon = styled(TimelineDot)`
 
  margin: 0;
  background-color: #f5f5f5;
  color: #616161;
  border-color:  ${palette.lightGrey};
  border-width: 0.5px;
`;

export const TimelineCenterLine = styled(TimelineConnector)`
  background-color: ${palette.lightGrey};
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
  padding: 0 3px 0 3px;
  margin: ${spacing.tiny};
  max-width: 196px; // per design
  transition: all 0.25s ease-out;
  margin: 0 2px 3px 0;

  &:hover {
    color: ${palette.darkGrey};
  }
`;

export const MembersContainer = styled(Typography).attrs({
  variant: "caption",
  color: "textSecondary",
})`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;

  strong {
    white-space: nowrap;
    margin-right: 4px;
    margin-top:  2px
  }

  & > div {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

export const WorkflowIconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({ filterIcon }) => (filterIcon ? '18px' : '16px')};
    height: ${({ filterIcon }) => (filterIcon ? '18px' : '16px')};
    color: inherit;
    border-color:  ${palette.lightGrey};
`;

export const CommentContainer = styled.div`
  max-width: 300px;
  width: 100%;
  padding: ${spacing.tiny} ${spacing.small};
  word-break: break-word;
  padding: 5px;
  margin: 2px;
`;

export const CommentDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin: 4px 0;
  color: ${palette.coolGrey1};
  font-size: 14px;


  & > .label {
    font-weight: bold;
    white-space: nowrap;
  }

  & > .value {
    flex: 1;
    text-align: left;
    word-break: break-word;
  }
`;

export const CommentTextWrapper = styled.div`
  width: 220;
`;

export const NotesHistoryContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

export const CommentText = styled.div`
  color: ${palette.mediumGrey};
  font-weight: normal;
  // max-width: 475px;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid ${palette.lightGrey};
  border-radius: 4px;
  padding: 8px;
  & p {
    margin-bottom: 2px;
  }
  word-break: break-word;
  white-space: normal;
  overflow-wrap: anywhere;
`;