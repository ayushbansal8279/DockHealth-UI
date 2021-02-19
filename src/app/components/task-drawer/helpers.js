import React from 'react';
import { RemoveCircleOutlineRounded } from '@material-ui/icons';
import Member from 'components/members/Member/Member';

import palette from 'styles/palette';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import moment from 'moment';
import {
  MemberLabelContainer,
  CondensedH4,
  CompletedByLabel,
} from './NewTaskDrawer.Styled';

export const DATE_ISO_FORMAT = 'YYYY-MM-DD';
export const TIME_12H_FORMAT = 'hh:mm A';

export const FocusDrawerFieldEnum = {
  PATIENT: 'patient',
  COMMENT: 'comment',
  ATTACHEMENT: 'attachement',
  LABEL: 'label',
};

export const TaskDrawerFields = {
  PATIENT: 1,
};

export const getCompletedByLabel = (completedBy, completedDt) => {
  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  return (
    <CompletedByLabel>{`Completed by ${completedByName} ${completedDt &&
      ` on ${
        completedDt ? `on ${moment(completedDt).format('MM/DD/YYYY')}` : ''
      }`}
  `}</CompletedByLabel>
  );
};

export const getFormattedMembers = ({ members, currentUser }) => {
  const filteredMembers = (members ?? []).filter(member => {
    return currentUser.userIdentifier !== member.userIdentifier;
  });
  const formattedMembers = filteredMembers.map(member => {
    const { userIdentifier, firstName, lastName } = member;
    const userName = `${firstName} ${lastName}`.trim();

    return {
      key: userIdentifier,
      value: userIdentifier,
      label: (
        <MemberLabelContainer key={member?.userIdentifier}>
          <CondensedH4>{userName}</CondensedH4>
          <Member member={member} size={34} />
        </MemberLabelContainer>
      ),
      displayLabel: userName,
      highlightSupport: true,
    };
  });

  formattedMembers.unshift({
    key: 'UNASSIGNED',
    value: 'UNASSIGNED',
    label: (
      <MemberLabelContainer>
        <CondensedH4>Unassigned</CondensedH4>
        <RemoveCircleOutlineRounded
          color="action"
          style={{ height: '34px', width: '34px' }}
        />
      </MemberLabelContainer>
    ),
    displayLabel: null,
    highlightSupport: false,
  });

  const currentUserName = `${currentUser.firstName} ${currentUser.lastName}`.trim();

  formattedMembers.unshift({
    key: currentUser.userIdentifier,
    value: currentUser.userIdentifier,
    label: (
      <MemberLabelContainer
        style={{
          paddingBottom: '5px',
          borderBottom: `1px solid ${palette.coolGrey3}`,
        }}
      >
        <CondensedH4>Assign to me</CondensedH4>
        <Member member={currentUser} size={34} />
      </MemberLabelContainer>
    ),
    displayLabel: currentUserName,
    highlightSupport: false,
  });
  return formattedMembers;
};

export const getFormattedLabel = label => {
  const { labelIdentifier, labelName } = label;
  return {
    key: labelIdentifier,
    value: labelIdentifier,
    label: <CondensedH4>{labelName}</CondensedH4>,
    displayLabel: labelName,
  };
};

export const getFormattedLabels = ({ labels }) =>
  (labels ?? []).map(label => getFormattedLabel(label));

export const renderPartsWithHighlighting = (optionValue, inputValue) => {
  const matches = match(optionValue, inputValue);
  const parts = parse(optionValue, matches);
  return (
    <>
      {parts.map(part => (
        <span
          key={`${optionValue}_${part}`}
          style={{ fontWeight: part.highlight ? 700 : 400 }}
        >
          {part.text}
        </span>
      ))}
    </>
  );
};

export const renderMemberoptionWithHighlighting = (option, inputValue) => {
  if (option?.highlightSupport === false) {
    return option?.label;
  }

  const highlightedLabelvalue = renderPartsWithHighlighting(
    option?.displayLabel,
    inputValue,
  );

  const func = children => {
    return React.Children.map(children, childNode => {
      if (typeof childNode === 'string') return highlightedLabelvalue;
      if (typeof childNode.props.children === 'string')
        return React.cloneElement(childNode, [], highlightedLabelvalue);
      return React.cloneElement(childNode, [], func(childNode.props.children));
    });
  };

  return (
    <MemberLabelContainer
      style={option?.label.props.style}
      key={option?.label.key}
    >
      {func(option?.label.props.children)}
    </MemberLabelContainer>
  );
};
