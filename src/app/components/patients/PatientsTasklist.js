import React from 'react';
import styled from 'styled-components';

const tasklist = [
  {
    taskId: 1033,
    description: 'Task 3',
    priority: 'LOW',
    status: 'INCOMPLETE',
    workflowStatus: null,
    dueDate: null,
    reminderDt: null,
    creator: {
      userId: 147,
      firstName: 'Dr. Levi',
      lastName: 'Breuer',
      userName: 'Dr. Levi Breuer',
      profileThumbnailPictureHash: null,
      titleList: '',
      specialtyList: '',
      initials: 'DB',
    },
    assignedTo: {
      userId: 146,
      firstName: 'Adam',
      lastName: 'D?browski',
      userName: 'Adam D?browski',
      profileThumbnailPictureHash: '5aa1acb5260470f858c15e978b2b3086',
      titleList: '',
      specialtyList: '',
      initials: 'AD',
    },
    assignedBy: {
      userId: 147,
      firstName: 'Dr. Levi',
      lastName: 'Breuer',
      userName: 'Dr. Levi Breuer',
      profileThumbnailPictureHash: null,
      titleList: '',
      specialtyList: '',
      initials: 'DB',
    },
    addedToListByUser: null,
    completedBy: null,
    comments: [],
    subtasks: [],
    completedDt: null,
    createdDateTime: '2019-02-07T17:52:14.000+0000',
    updatedDateTime: '2019-07-05T00:48:06.000+0000',
    assignmentUpdatedDateTime: '2019-02-07T17:52:14.000+0000',
    read: true,
    seen: null,
    seenDt: null,
    patient: null,
    type: 'IN_APP',
    taskList: {
      taskListId: 206,
      listName: 'List 1',
    },
    parentTaskId: null,
    active: true,
    sourceMessage: null,
    subTaskSortIndex: null,
  },
  {
    taskId: 1032,
    description: 'Task 2',
    priority: 'LOW',
    status: 'INCOMPLETE',
    workflowStatus: null,
    dueDate: null,
    reminderDt: null,
    creator: {
      userId: 147,
      firstName: 'Dr. Levi',
      lastName: 'Breuer',
      userName: 'Dr. Levi Breuer',
      profileThumbnailPictureHash: null,
      titleList: '',
      specialtyList: '',
      initials: 'DB',
    },
    assignedTo: {
      userId: 146,
      firstName: 'Adam',
      lastName: 'D?browski',
      userName: 'Adam D?browski',
      profileThumbnailPictureHash: '5aa1acb5260470f858c15e978b2b3086',
      titleList: '',
      specialtyList: '',
      initials: 'AD',
    },
    assignedBy: {
      userId: 147,
      firstName: 'Dr. Levi',
      lastName: 'Breuer',
      userName: 'Dr. Levi Breuer',
      profileThumbnailPictureHash: null,
      titleList: '',
      specialtyList: '',
      initials: 'DB',
    },
    addedToListByUser: null,
    completedBy: null,
    comments: [],
    subtasks: [
      {
        taskId: 1134,
        description: 'New subtask',
        priority: 'LOW',
        status: 'INCOMPLETE',
        workflowStatus: null,
        dueDate: null,
        reminderDt: null,
        creator: {
          userId: 146,
          firstName: 'Adam',
          lastName: 'D?browski',
          userName: 'Adam D?browski',
          profileThumbnailPictureHash: '5aa1acb5260470f858c15e978b2b3086',
          titleList: '',
          specialtyList: '',
          initials: 'AD',
        },
        assignedTo: null,
        assignedBy: null,
        addedToListByUser: null,
        completedBy: null,
        comments: [],
        subtasks: [],
        completedDt: null,
        createdDateTime: '2019-06-05T15:12:54.000+0000',
        updatedDateTime: '2019-07-05T00:48:06.000+0000',
        assignmentUpdatedDateTime: null,
        read: true,
        seen: null,
        seenDt: null,
        patient: null,
        type: 'IN_APP',
        taskList: null,
        parentTaskId: 1032,
        active: true,
        sourceMessage: null,
        subTaskSortIndex: null,
      },
      {
        taskId: 1135,
        description: 'New subtask',
        priority: 'LOW',
        status: 'INCOMPLETE',
        workflowStatus: null,
        dueDate: null,
        reminderDt: null,
        creator: {
          userId: 146,
          firstName: 'Adam',
          lastName: 'D?browski',
          userName: 'Adam D?browski',
          profileThumbnailPictureHash: '5aa1acb5260470f858c15e978b2b3086',
          titleList: '',
          specialtyList: '',
          initials: 'AD',
        },
        assignedTo: null,
        assignedBy: null,
        addedToListByUser: null,
        completedBy: null,
        comments: [],
        subtasks: [],
        completedDt: null,
        createdDateTime: '2019-06-05T15:13:11.000+0000',
        updatedDateTime: '2019-07-05T00:48:06.000+0000',
        assignmentUpdatedDateTime: null,
        read: true,
        seen: null,
        seenDt: null,
        patient: null,
        type: 'IN_APP',
        taskList: null,
        parentTaskId: 1032,
        active: true,
        sourceMessage: null,
        subTaskSortIndex: null,
      },
      {
        taskId: 1136,
        description: 'New subtask',
        priority: 'LOW',
        status: 'INCOMPLETE',
        workflowStatus: null,
        dueDate: null,
        reminderDt: null,
        creator: {
          userId: 146,
          firstName: 'Adam',
          lastName: 'D?browski',
          userName: 'Adam D?browski',
          profileThumbnailPictureHash: '5aa1acb5260470f858c15e978b2b3086',
          titleList: '',
          specialtyList: '',
          initials: 'AD',
        },
        assignedTo: null,
        assignedBy: null,
        addedToListByUser: null,
        completedBy: null,
        comments: [],
        subtasks: [],
        completedDt: null,
        createdDateTime: '2019-06-05T15:13:13.000+0000',
        updatedDateTime: '2019-07-05T00:48:06.000+0000',
        assignmentUpdatedDateTime: null,
        read: true,
        seen: null,
        seenDt: null,
        patient: null,
        type: 'IN_APP',
        taskList: null,
        parentTaskId: 1032,
        active: true,
        sourceMessage: null,
        subTaskSortIndex: null,
      },
    ],
    completedDt: null,
    createdDateTime: '2019-02-07T17:52:02.000+0000',
    updatedDateTime: '2019-07-05T00:48:06.000+0000',
    assignmentUpdatedDateTime: '2019-02-07T17:52:02.000+0000',
    read: true,
    seen: null,
    seenDt: null,
    patient: null,
    type: 'IN_APP',
    taskList: {
      taskListId: 206,
      listName: 'List 1',
    },
    parentTaskId: null,
    active: true,
    sourceMessage: null,
    subTaskSortIndex: null,
  },
  {
    taskId: 1035,
    description: 'Task 5',
    priority: 'LOW',
    status: 'INCOMPLETE',
    workflowStatus: null,
    dueDate: null,
    reminderDt: null,
    creator: {
      userId: 147,
      firstName: 'Dr. Levi',
      lastName: 'Breuer',
      userName: 'Dr. Levi Breuer',
      profileThumbnailPictureHash: null,
      titleList: '',
      specialtyList: '',
      initials: 'DB',
    },
    assignedTo: {
      userId: 146,
      firstName: 'Adam',
      lastName: 'D?browski',
      userName: 'Adam D?browski',
      profileThumbnailPictureHash: '5aa1acb5260470f858c15e978b2b3086',
      titleList: '',
      specialtyList: '',
      initials: 'AD',
    },
    assignedBy: {
      userId: 146,
      firstName: 'Adam',
      lastName: 'D?browski',
      userName: 'Adam D?browski',
      profileThumbnailPictureHash: '5aa1acb5260470f858c15e978b2b3086',
      titleList: '',
      specialtyList: '',
      initials: 'AD',
    },
    addedToListByUser: null,
    completedBy: {
      userId: 146,
      firstName: 'Adam',
      lastName: 'D?browski',
      userName: 'Adam D?browski',
      profileThumbnailPictureHash: '5aa1acb5260470f858c15e978b2b3086',
      titleList: '',
      specialtyList: '',
      initials: 'AD',
    },
    comments: [],
    subtasks: [
      {
        taskId: 1190,
        description: '',
        priority: 'LOW',
        status: 'INCOMPLETE',
        workflowStatus: null,
        dueDate: null,
        reminderDt: null,
        creator: {
          userId: 146,
          firstName: 'Adam',
          lastName: 'D?browski',
          userName: 'Adam D?browski',
          profileThumbnailPictureHash: '5aa1acb5260470f858c15e978b2b3086',
          titleList: '',
          specialtyList: '',
          initials: 'AD',
        },
        assignedTo: null,
        assignedBy: null,
        addedToListByUser: null,
        completedBy: null,
        comments: [],
        subtasks: [],
        completedDt: null,
        createdDateTime: '2019-06-14T15:38:40.000+0000',
        updatedDateTime: '2019-07-05T00:48:06.000+0000',
        assignmentUpdatedDateTime: null,
        read: true,
        seen: null,
        seenDt: null,
        patient: null,
        type: 'IN_APP',
        taskList: null,
        parentTaskId: 1035,
        active: true,
        sourceMessage: null,
        subTaskSortIndex: null,
      },
    ],
    completedDt: null,
    createdDateTime: '2019-02-07T17:52:35.000+0000',
    updatedDateTime: '2019-07-05T00:48:06.000+0000',
    assignmentUpdatedDateTime: '2019-06-14T15:32:46.000+0000',
    read: true,
    seen: null,
    seenDt: null,
    patient: {
      createdBy: '65',
      createdDateTime: '2017-08-31T13:53:06.000+0000',
      updatedBy: '65',
      updatedDateTime: '2017-08-31T13:53:06.000+0000',
      patientId: 39,
      mrn: '123113123',
      firstName: '1234',
      lastName: '1234',
      dob: null,
      gender: 'female',
      phoneHome: '',
      phoneMobile: '',
      email: 'kjggg@gdgg.com',
      active: true,
      notes: '',
      organization: {
        createdBy: 'SYSTEM',
        createdDateTime: '2018-07-26T02:50:21.000+0000',
        updatedBy: null,
        updatedDateTime: '2018-07-26T02:50:21.000+0000',
        organizationId: 1,
        organizationName: 'DOCK Test Organization',
        active: null,
        domain: 'childrens.harvard.edu,tch.harvard.edu,chboston.org,htdevelopers.com,psychcaremd.com',
        authorizationType: null,
        autoEnroll: true,
        personalOrganization: null,
        emrIntegrationEnabled: true,
      },
      creator: null,
    },
    type: 'IN_APP',
    taskList: {
      taskListId: 206,
      listName: 'List 1',
    },
    parentTaskId: null,
    active: true,
    sourceMessage: null,
    subTaskSortIndex: null,
  },
];

const PatientsTasklistCount = styled.div`
  font-size: 16px;
  color: #2e3a43;
  margin-bottom: 11px;
`;

const PatientsTasklistTask = styled.div`
  border-radius: 3px;
  border: solid 1px #a6dcea;
  background-color: #ffffff;
  
  margin-left: -20px;
  margin-right: -23px;
`;

const PatientsTasklistFlag = styled.div`
  width: 5px;
  background-color: #fb7c06;
  flex-shrink: 0;
`;

const PatientsTasklistProfile = styled.div`
  height: 67px;
  width: 67px;
  background: rgb(0, 167, 60);;
  border-radius: 50%;
  margin: 14px 8px 0 8px;
`;

const PatientsTasklistNew = styled.div`
  color: #d9036b;
  font-size: 10px;
  font-variant: small-caps;
  
`;

const PatientsTasklistDescription = styled.div`
  font-size: 20px;
  color: #303538;
`;

const PatientsTasklistInfo = styled.div`
  font-size: 14px;
  color: #5e6366;
`;

const PatientsTasklistComments = styled.div`
  font-size: 14px;
  color: #0ca1c7;
`;

const PatientsTasklistDate = styled.div`
  font-size: 20px;
  color: #303538;
`;

const PatientsTasklistPriority = styled.div`
  width: 10px;
  height: 10px;
  background-color: #df0000;
  border-radius: 50%;
  margin-right: 23px;
`;

const PatientsTasklistSubtasks = styled.div`
  width: 560px;
  height: 44px;
  border-radius: 1px;
  border: solid 3px #f5f8fa;
  
  font-size: 20px;
  line-height: 38px;
  color: #2e3a43;
  margin: 18px auto 12px auto;
  padding-left: 15px;
`;

const PatientsTasklistShowCompleted = styled.div`
  width: 344px;
  height: 37px;
  border-radius: 57.4px;
  background-color: #0ca1c7;
  
  font-size: 20px;
  color: #ffffff;
  
  text-align: center;
  margin: 36px auto 0 auto;
  line-height: 36px;
`;

const PatientsTasklist = () => {
  const tasks = tasklist;
  return (
    <div>
      <PatientsTasklistCount>23 tasks</PatientsTasklistCount>
      <PatientsTasklistTask>
        <div style={{ display: 'flex' }}>
          <PatientsTasklistFlag />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex' }}>
              <PatientsTasklistProfile />
              <div style={{ flex: 1 }}>
                <div style={{
                  height: '22px',
                  marginBottom: '-7px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                >
                  <PatientsTasklistNew>NEW</PatientsTasklistNew>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <PatientsTasklistDescription>Schedule scope for Sally</PatientsTasklistDescription>
                    <PatientsTasklistInfo>Assigned by Megan Smith • 1:22pm</PatientsTasklistInfo>
                    <PatientsTasklistComments>5 comments</PatientsTasklistComments>
                  </div>
                  <div>BELL</div>
                  <div>
                    <PatientsTasklistDate>Mon, Jan 22</PatientsTasklistDate>
                    <PatientsTasklistDate>@ 9:30am</PatientsTasklistDate>
                  </div>
                  <PatientsTasklistPriority />
                </div>
              </div>
            </div>
            <PatientsTasklistSubtasks>
              Subtasks (8) ▸
            </PatientsTasklistSubtasks>
          </div>
        </div>
      </PatientsTasklistTask>
      <PatientsTasklistShowCompleted>
        Show completed tasks (2)
      </PatientsTasklistShowCompleted>
    </div>
  );
};

export default PatientsTasklist;
