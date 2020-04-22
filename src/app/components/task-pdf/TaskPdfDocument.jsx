import { Document, pdf, PDFViewer } from '@react-pdf/renderer';
import styled from '@react-pdf/styled-components';
import { memoizeWith, isEmpty, head } from 'ramda';
import React from 'react';
import { useAsync } from 'react-use';
import { getUserAvatarBuffer } from 'api/people-api';
import { noop } from 'helpers/utility-functions';
import palette from 'styles/palette';
import PdfTask from './PdfTask';
import { AvatarImage, AvatarInitials } from './PdfTask.Styled';

const getAvatarContent = memoizeWith(
  propsObject => Object.values(propsObject).join('-'),
  ({ userIdentifier, profileThumbnailPictureHash }) => {
    if (profileThumbnailPictureHash) {
      return getUserAvatarBuffer({ userIdentifier });
    }

    return Promise.resolve(null);
  },
);

const StyledPage = styled.Page`
  margin: 0 12pt 12pt;
`;

const HeaderView = styled.View`
  align-items: center;
  background-color: ${palette.unknownGrey6};
  display: flex;
  flex-flow: row nowrap;
  height: 12pt;
  margin-top: 12pt;
  width: 96vw;
`;

const HeaderText = styled.Text`
  color: ${palette.black};
  font-family: 'Open Sans';
  font-size: 8pt;
  padding: 0 4pt;
  text-align: ${props => props.textAlign ?? 'left'};
  width: ${props => props.width}pt;
`;

const renderTask = ({ taskListMembers, taskListMembersAvatars }) => ({
  taskIdentifier,
  ...props
}) => (
  <PdfTask
    key={taskIdentifier}
    taskIdentifier={taskIdentifier}
    taskListMembers={taskListMembers}
    taskListMembersAvatars={taskListMembersAvatars}
    {...props}
  />
);

export const TaskPdfDocument = ({
  tasks,
  taskListMembers,
  taskListMembersAvatars,
}) => {
  return (
    <Document>
      <StyledPage size="A4" wrap>
        <HeaderView fixed>
          <HeaderText width={60} textAlign="right">
            ASSIGNED
          </HeaderText>
          <HeaderText width={240}>TASK</HeaderText>
          <HeaderText width={128}>PATIENT</HeaderText>
          <HeaderText width={68}>DUE</HeaderText>
          <HeaderText width={48} textAlign="right">
            STATUS
          </HeaderText>
        </HeaderView>
        {tasks?.map(renderTask({ taskListMembers, taskListMembersAvatars }))}
      </StyledPage>
    </Document>
  );
};

export const getAllMembersAvatars = async ({ taskListMembers }) => {
  const taskListMembersPicturesMap = new Map();

  const membersAvatarsArray = await Promise.all(
    taskListMembers.map(async member => {
      const {
        userIdentifier,
        email,
        profileThumbnailPictureHash,
        initials,
      } = member;

      let downloadedAvatarContent = null;

      try {
        downloadedAvatarContent = await getAvatarContent({
          userIdentifier,
          profileThumbnailPictureHash,
        });
      } catch {
        noop();
      }

      const finalContent = downloadedAvatarContent?.data ? (
        <AvatarImage src={downloadedAvatarContent} />
      ) : (
        <AvatarInitials>{initials || ''}</AvatarInitials>
      );

      return {
        userIdentifier: userIdentifier ?? email,
        finalContent,
      };
    }),
  );

  membersAvatarsArray.forEach(({ userIdentifier, finalContent }) => {
    taskListMembersPicturesMap.set(userIdentifier, finalContent);
  });

  return taskListMembersPicturesMap;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const downloadPdf = ({ url, tasks }) => {
  const taskListIdSuffix = isEmpty(tasks ?? [])
    ? ''
    : head(tasks)?.taskList?.taskListIdentifier ?? 'dock';

  const link = document.createElement('a');
  link.setAttribute('target', '_blank');
  link.setAttribute('href', url);
  link.setAttribute('download', `task-list-${taskListIdSuffix}.pdf`);

  document.body.append(link);
  link.click();
};

export const printTaskPdf = async ({ tasks, taskListMembers }) => {
  const taskListMembersAvatars = await getAllMembersAvatars({
    taskListMembers,
  });

  const pdfBlob = await pdf(
    <TaskPdfDocument
      tasks={tasks}
      taskListMembers={taskListMembers}
      taskListMembersAvatars={taskListMembersAvatars}
    />,
  ).toBlob();
  const pdfObjectUrl = URL.createObjectURL(pdfBlob);

  const newWindow = window.open(pdfObjectUrl, '_blank');
  newWindow.focus();
};

export const TaskPdfPreview = ({ tasks, taskListMembers }) => {
  const membersAvatarsData = useAsync(async () => {
    return getAllMembersAvatars({ taskListMembers });
  }, [taskListMembers]);

  if (membersAvatarsData.loading || membersAvatarsData.error) {
    return null;
  }

  return (
    <PDFViewer width="100%" height={400}>
      <TaskPdfDocument
        tasks={tasks}
        taskListMembers={taskListMembers}
        taskListMembersAvatars={membersAvatarsData.value}
      />
    </PDFViewer>
  );
};
