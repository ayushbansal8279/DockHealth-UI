import React from 'react';
import { storiesOf } from '@storybook/react';
import MemberAssignment from '../src/app/components/home/MemberAssignment';
// import SampleAvatar from '../src/app/img/sample_avatar.jpeg';
// import { action } from '@storybook/addon-actions';

const member = {
  userId: 125,
  firstName: 'Micheal',
  lastName: 'Docktor',
  initials: 'MD',
};

const memberWithPicture = {
  ...member,
  profileThumbnailPictureHash: 'e918f852b3904b37d0335f0052b43d08',
};

storiesOf('MemberAssignment/large', module)
  .add('unassigned', () => <MemberAssignment large />)
  .add('assigned', () => <MemberAssignment member={member} large />)
  .add('assigned w/ different color', () => <MemberAssignment member={{ ...member, color: '#007CAB ' }} large />)
  .add('assigned w/ picture', () => <MemberAssignment member={memberWithPicture} large />);
