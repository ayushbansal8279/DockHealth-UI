import styled from '@react-pdf/styled-components';
import palette from 'styles/palette';

const addWidth = ({ width }) => `
  max-width: ${width}pt;
  width: ${width}pt;
`;

export const PdfTaskWrapper = styled.View`
  padding-top: 1px;
  padding-bottom: 1px;

  ${props => props.isSubtask && 'padding-right: 45pt;'}
`;

export const TaskContainer = styled.View`
  position: relative;
  display: flex;
  align-items: center;
  flex-flow: row wrap;
  width: 100vw;
  padding-right: 33pt;
  ${props => props.isSubtask && 'padding-right: 45pt;'}
`;

export const TaskInnerContainer = styled.View`
  display: flex;
  align-items: center;
  flex-flow: row wrap;
  width: 100%;
  height: 36pt;
  position: relative;
  margin-left: 10pt;
  border-color: ${palette.coolGrey3};
  border-style: solid;
  border-width: 1pt;
`;

export const TaskInBundleContainer = styled.View`
  padding-right: 5pt;
`;

export const SubtasksContainer = styled.View`
  padding-left: 12pt;
  padding-right: 5pt;
`;

export const InitialSpacing = styled.View`
  height: 100%;
  width: 5pt;
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
  color: ${({ color }) => color || palette.unknownGrey7};
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

export const ArrowContainer = styled.View`
  width: 14pt;
`;

export const ArrowIconWrapper = styled.Image`
  height: 5pt;
  width: 8pt;
`;

export const PriorityStrip = styled.Image`
  height: 14pt;
  width: 8pt;
`;

export const PriorityStripContainer = styled.View`
  position: absolute;
  left: -8pt;
  top: 0;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  height: 100%;
`;

export const AssignedToContainer = styled.View`
  height: 28pt;
  overflow: hidden;
  width: 88pt;
`;

export const AssignToText = styled.Text`
  color: ${palette.unknownGrey7};
  font-family: 'Open Sans';
  font-size: 7pt;
  margin-left: 2pt;
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
  justify-content: center;
  ${addWidth}
  padding-top: 4pt;
  border-left: 1pt solid ${palette.coolGrey3};
`;

export const TextLabel = styled.Text`
  display: flex;
  flex: 1;
  color: ${props => (props.isRed ? palette.error : palette.unknownGrey7)};
  font-family: 'Open Sans';
  font-size: 7pt;
  max-height: 14pt;
  margin-top: 1pt;
  padding-left: 4pt;
  text-align: left;
`;

export const StatusContainer = styled.View`
  display: flex;
  flex-flow: row no-wrap;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 55pt;
  max-width: 55pt;
  border-left: 1pt solid ${palette.coolGrey3};
  border-right: 1pt solid ${palette.coolGrey3};
`;

export const StatusColorContainer = styled.View`
  height: 100%;
  width: 5pt;
  background-color: ${({ color }) => color};
`;

export const DueDateContainer = styled(InnerContainer)`
  width: 50pt;
  max-width: 50pt;
  padding-top: 4pt;
  border-left: 1pt solid ${palette.coolGrey3};
`;

export const ListNameContainer = styled(InnerContainer)`
  ${addWidth}
  padding-top: 4pt;
  border-left: 1pt solid ${palette.coolGrey3};
`;
