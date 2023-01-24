import linkifyString from 'linkifyjs/string';
import escape from 'lodash.escape';
import escapeRegExp from 'lodash.escaperegexp';
import curry from 'ramda/src/curry';
import Swal from 'sweetalert2';
import parsePhoneNumber from 'libphonenumber-js';

export const noop = () => {};

export function mapWithRemove(mapFunction, array) {
  if (!array) {
    return null;
  }

  return array?.reduce((accumulator, item) => {
    const mappedItem = mapFunction(item);

    if (mappedItem) {
      accumulator.push(mappedItem);
    }

    return accumulator;
  }, []);
}

export const getPatientName = (patientData) => {
  const { withMrn = true, ...patient } = patientData || {};
  const { mrn, firstName, middleName, lastName } = patient || {};

  return `${lastName || ''}, ${firstName || ''} ${middleName || ''} ${
    (withMrn && mrn) || ''
  }`
    .replace(/\s{2,}/g, ' ')
    .trim()
    .replace(/^,$|^,|,$/, '');
};

// eslint-disable-next-line unicorn/prevent-abbreviations
export const mergeRefs = (refs) => (value) => {
  for (const reference of refs) {
    if (typeof reference === 'function') {
      reference(value);
    } else if (reference != undefined) {
      // eslint-disable-next-line no-param-reassign
      reference.current = value;
    }
  }
};

export const isTaskArchivable = curry(
  (currentUserProfile, task) =>
    task?.status === 'COMPLETE' &&
    !task?.parentTaskIdentifier &&
    !task?.archivedByUser &&
    (task?.creator?.userIdentifier === currentUserProfile?.userIdentifier ||
      task?.assignedBy?.userIdentifier === currentUserProfile?.userIdentifier),
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

const getDescriptionMentionRegex = (name) =>
  new RegExp(`(^|\\s)(@${escapeRegExp(name)})`, 'gi');

export const mentionifyDescription = ({ members, value }) => {
  let newValue = value;

  if (members && Array.isArray(members)) {
    for (const { userIdentifier, firstName, lastName, userName } of members) {
      const sanitizedFirstName = escape(firstName);
      const sanitizedLastName = escape(lastName);
      const sanitizedUserName = escape(userName);

      const mentionNameReplacer = `$1<a class="decorated-link" href="#/assignedToPerson/${userIdentifier}">$2</a>`;

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
    }
  }

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

export const formatPhoneNumber = (phoneNumber = '') => {
  if (!phoneNumber) return '';

  const parsedNumber = parsePhoneNumber(phoneNumber);
  if (!parsedNumber) return '';

  return `+${parsedNumber.countryCallingCode} ${parsedNumber.formatNational()}`;
};

export const showToast = ({
  status: icon,
  text = '',
  title,
  ...otherOptions
}) => {
  const swalPromise = Swal.fire({
    icon,
    title,
    text,
    toast: true,
    position: 'top-end',
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    ...otherOptions,
  });
  // fix z-index for drawer container
  Swal.getContainer().style.zIndex = 10_000;

  return swalPromise;
};

export const showAlert = ({
  status: icon,
  text = '',
  title,
  confirmationCallback = null,
  ...otherOptions
}) => {
  const swalPromise = Swal.fire({
    icon,
    title,
    text,
    ...otherOptions,
  }).then(({ value }) => {
    if (value && confirmationCallback) {
      confirmationCallback();
    }
  });
  // fix z-index for drawer container
  Swal.getContainer().style.zIndex = 10_000;

  return swalPromise;
};

export const setCurrentPageInSessionStorage = (currentPathname) => {
  sessionStorage.setItem('next-page', currentPathname);
};

export const setCurrentPageAfterLogin = (currentPathname) => {
  setCurrentPageInSessionStorage(currentPathname);
};

export const useSmallScreen = () =>
  window?.innerWidth <= 960 && window?.innerHeight <= 960;

export const useMobile = () =>
  navigator?.userAgent?.toLowerCase()?.includes?.('mobi') ?? false;

export const useIOS = () => /ipad|iphone|ipod/i.test(navigator.userAgent);

export function trunc(text, maxLength = 30) {
  return text?.length > maxLength
    ? `${text?.slice(0, Math.max(0, maxLength))}...`
    : text;
}
