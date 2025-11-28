import { Collapse, Typography } from '@mui/material';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const GroupOptionsContainer = styled.div`
  transform: rotate(-90deg);
`;

export const GroupOpenContainer = styled.div`
  height: 23px;
  width: 30px;
  display: flex;
  align-items: center;
  flex-basis: content;
  padding-left: 5px;
  padding-right: 5px;
  background-color: ${palette.white};
`;

export const TasksGroupActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const TasksGroupActionButton = styled.button`
  display: ${(props) => (props.isDisplayed ? 'flex' : 'none')};
  align-items: center;
  cursor: pointer;
  padding: 0 ${spacing.smallPlus};
  color: ${palette.lightGrey};

  &:last-of-type {
    padding-right: 0px;
  }

  & > p {
    margin-bottom: 0px;
    margin-left: ${spacing.tiny};
  }
`;

export const Arrow = styled.img`
  transform: ${(props) => (props.isOpen ? 'rotateX(180deg)' : '')};
  -webkit-transform: ${(props) => (props.isOpen ? 'rotateX(180deg)' : '')};
  padding-left: ${spacing.tiny};
  padding-right: ${spacing.smallPlus};
  transition: all 0.5s ease-in-out;
`;

export const TasksGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: ${spacing.giga};
  background: ${({ bgColor }) => (bgColor ? palette.aliceBlue : '')};
  width: ${({ $width }) => $width};
`;

export const TasksGroupHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  padding-bottom: ${spacing.regular};
  position: sticky;
  width: ${({ $width }) => $width};
  left: ${({ $left }) => `${$left}px`};
  padding-top: ${spacing.regular};
  .action-buttons {
    visibility: hidden;
  }
  &:hover {
    .action-buttons {
      visibility: visible;
    }
  }
`;

export const TasksGroupLabel = styled.p`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
`;

export const TasksGroupLabelName = styled.span`
  display: inline-block;
  max-width: 400px;
  padding-right: ${spacing.tiny};
  padding-left: ${spacing.small};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-family: Outfit, sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 22.68px;
  letter-spacing: 0.307692289352417px;
  text-align: left;
`;

export const TasksGroupNumericalBadgeContainer = styled.div`
  height: 30px;
  border-radius: 12px;
  background: ${palette.whiteSmoke};
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border: 1px solid ${palette.iron};

  &:first-of-type {
    background: linear-gradient(135deg, #e3f2fd 0%, #d1e9f6 100%);
    border: 1px solid rgba(66, 133, 244, 0.15);
  }
`;

export const TasksGroupTaskCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #5a6c7d;
  font-weight: 600;
  font-size: 11px;
`;

export const TasksGroupTaskCountIcon = styled.img`
  width: 15px;
  height: 15px;
  filter: invert(40%) sepia(15%) saturate(360%) hue-rotate(160deg)
    brightness(95%) contrast(95%);
`;

export const TasksGroupLabelCounter = styled.span`
  display: inline-block;
  width: 40px;
  vertical-align: middle;
`;

export const Tasks = styled(Collapse)`
  // height: 300px;
`;

export const GroupNameSectionWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const MoveUpIcon = styled.img`
  transform: rotate(-180deg);
`;

export const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  margin-top: ${spacing.regular};
  margin-left: ${spacing.huge};
  color: ${(props) =>
    props.disabled ? palette.coolGrey2 : palette.brightBlue};
  font-size: ${fontSizes.regular};
  cursor: ${(props) => (props.disabled ? 'initial' : 'pointer')};
`;

export const ShowMoreButton = styled.button`
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  color: ${palette.brightBlue};
  font-size: ${fontSizes.smallPlus};
  margin-left: 56px; // per design
  width: fit-content;
`;
