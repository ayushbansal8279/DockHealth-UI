import styled from '@react-pdf/styled-components';
import palette from '../../palette';

export const TaskContainer = styled.View`
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  height: 36pt;
  position: relative;
  border-color: ${palette.unknownGrey6};
  border-style: solid;
  border-width: 0;

  ${props =>
    props.isSubtask
      ? 'border-width: 1pt; margin-top: 2pt; margin-right: 17pt;'
      : 'width: 100vw;'}
`;

export const SubtasksContainer = styled.View`
  border: 1pt solid ${palette.white};
  padding-left: 12pt;
  padding-right: 5pt;
`;

export const InitialSpacing = styled.View`
  height: 100%;
  width: 4pt;
`;

export const InnerContainer = styled.View`
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  height: 100%;
  margin: 0 2pt;
`;

export const InlineContainer = styled.View`
  align-items: center;
  display: inline-flex;
  flex-flow: row wrap;
`;

export const TaskDescription = styled.Text`
  font-family: 'Open Sans';
  font-size: 8pt;
  font-weight: bold;
  max-height: 16pt;
  ${props =>
    props.isEdited ? `max-width: ${props.mainContainerWidth - 36}pt;` : ''}
  text-overflow: ellipsis;
`;

export const TaskSubLabel = styled.Text`
  color: ${palette.unknownGrey7};
  font-family: 'Open Sans';
  font-size: 7pt;
`;

export const EditedLabel = styled.Text`
  color: ${palette.unknownGrey5};
  font-family: 'Open Sans';
  font-size: 7pt;
  margin-left: 2pt;
`;

export const CheckboxContainer = styled.Image`
  height: 14pt;
  width: 14pt;
`;

export const PriorityStrip = styled.View`
  background-color: ${palette.orangeJulius};
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 2pt;
`;

export const AvatarContainer = styled.View`
  align-items: center;
  display: flex;
  border: 1pt solid ${props => props.color ?? palette.unknownGrey6};
  border-radius: 28pt;
  height: 28pt;
  justify-content: center;
  overflow: hidden;
  margin: 3pt;
  width: 28pt;
`;

export const Avatar = styled.View`
  align-items: center;
  display: flex;
  background-color: ${props => props.color ?? palette.unknownGrey6};
  border-radius: 23pt;
  height: 23pt;
  justify-content: center;
  width: 23pt;
`;

export const AvatarInitials = styled.Text`
  color: ${palette.white};
  font-family: 'Open Sans';
  font-size: 8pt;
  font-weight: bold;
`;

export const AvatarImage = styled.Image`
  border-radius: 23pt;
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

export const StyledProfileIcon = styled.Image`
  height: 13pt;
  width: 14pt;
`;

export const StyledClipIcon = styled.Image`
  height: 8pt;
  margin-right: 2pt;
  width: 4pt;
`;

export const MainInnerContainer = styled(InnerContainer)`
  max-width: ${props => props.mainContainerWidth}pt;
  width: ${props => props.mainContainerWidth}pt;
`;

export const PatientContainer = styled(InnerContainer)`
  justify-content: flex-end;
  margin-bottom: 8pt;
  max-width: 120pt;
  width: 120pt;
`;

export const SideContainer = styled(PatientContainer)`
  max-width: 60pt;
  width: 60pt;
`;

export const PatientLabel = styled.Text`
  color: ${palette.lighterCyanBlue};
  font-family: 'Open Sans';
  font-size: 7pt;
  max-height: 14pt;
  margin-bottom: 4pt;
`;

export const DueDateLabel = styled.Text`
  color: ${props => (props.isOverdue ? palette.error : palette.unknownGrey1)};
  font-family: 'Open Sans';
  font-size: 7pt;
  max-height: 14pt;
  margin-bottom: 4pt;
`;

export const StatusContainer = styled.View`
  align-items: flex-end;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  height: 100%;
  max-width: 40pt;
  margin-left: 4pt;
  margin-bottom: 20pt;
  width: 40pt;
`;

export const StatusDot = styled.View`
  background-color: ${props => props.color};
  border-radius: 4px;
  height: 4px;
  width: 4px;
`;

export const SubtaskOrderContainer = styled.View`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 18pt;
`;

export const SubtaskOrderLabel = styled.Text`
  font-family: 'Open Sans';
  font-size: 8pt;
  font-weight: bold;
`;
