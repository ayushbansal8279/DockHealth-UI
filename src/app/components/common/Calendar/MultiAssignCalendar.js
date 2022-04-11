import React from 'react';
import MemberGroup from 'components/user/MemberGroup/MemberGroup';

const MultiAssignCalendar = ({ assignedToUsers }) => (
  <MemberGroup size={25} max={1} members={assignedToUsers} />
);

export default MultiAssignCalendar;
