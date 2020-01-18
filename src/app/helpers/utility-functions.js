import curry from 'ramda/es/curry';
import escape from 'lodash.escape';
import escapeRegExp from 'lodash.escaperegexp';
import linkifyString from 'linkifyjs/string';
import Swal from 'sweetalert2';

export const noop = () => {};

export const getPatientName = patientData => {
  const { withMrn = true, ...patient } = patientData || {};
  const { mrn, firstName, middleName, lastName } = patient || {};

  return `${lastName || ''}, ${firstName || ''} ${middleName ||
    ''} ${(withMrn && mrn) || ''}`
    .replace(/\s{2,}/g, ' ')
    .trim()
    .replace(/^,$|^,|,$/, '');
};

// eslint-disable-next-line unicorn/prevent-abbreviations
export const mergeRefs = refs => value => {
  refs.forEach(reference => {
    if (typeof reference === 'function') {
      reference(value);
    } else if (reference != null) {
      // eslint-disable-next-line no-param-reassign
      reference.current = value;
    }
  });
};

export const isTaskArchivable = curry(
  (currentUserProfile, task) =>
    task?.status === 'COMPLETE' && !task?.parentTaskId && !task?.archivedByUser,
);

export const formatLinkifyHref = (href, type) => {
  if (type === 'mention') {
    return `#/people?searchName=${href.replace(/^\//, '')}`;
  }

  return href;
};

export const targetLinkify = (href, type) => {
  if (type === 'mention') {
    return '_self';
  }

  return '_blank';
};

const getDescriptionMentionRegex = name =>
  new RegExp(`(^|\\s)(@${escapeRegExp(name)})`, 'gi');

export const mentionifyDescription = ({ members, value }) => {
  let newValue = value;

  members.forEach(({ userId, firstName, lastName, userName }) => {
    const sanitizedFirstName = escape(firstName);
    const sanitizedLastName = escape(lastName);
    const sanitizedUserName = escape(userName);

    const mentionNameReplacer = `$1<a class="decorated-link" href="#/assignedToPerson/${userId}/${sanitizedUserName}">$2</a>`;

    newValue = newValue
      .replace(
        getDescriptionMentionRegex(sanitizedUserName),
        mentionNameReplacer,
      )
      .replace(
        getDescriptionMentionRegex(sanitizedFirstName),
        mentionNameReplacer,
      )
      .replace(
        getDescriptionMentionRegex(sanitizedLastName),
        mentionNameReplacer,
      );
  });

  return newValue;
};

export const linkifyTaskText = ({ value }) =>
  linkifyString(value, {
    defaultProtocol: 'https',
    className: 'decorated-link',
    formatHref: formatLinkifyHref,
    format: escape,
    // ignoreTags: ['script', 'style'],
    target: targetLinkify,
  });

export const mentionifyAndLinkifyTaskText = ({ members, value }) =>
  mentionifyDescription({ members, value: linkifyTaskText({ value }) });

export const formatPhoneNumber = (phoneNumber = '') =>
  phoneNumber ? phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '';

export const showToast = ({
  status: icon,
  text = '',
  title,
  ...otherOptions
}) => {
  Swal.fire({
    icon,
    title,
    text,
    toast: true,
    position: 'top-end',
    timer: 3000,
    timerProgressBar: true,
    ...otherOptions,
  });
  // fix z-index for drawer container
  Swal.getContainer().style.zIndex = 10000;
};
