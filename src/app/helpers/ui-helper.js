/* eslint-disable no-unused-expressions */
/* eslint-disable import/prefer-default-export */
import { isEmpty } from 'ramda';

export function scrollToError(errors) {
  if (errors && !isEmpty(errors)) {
    const errorsvalues = Object.values(errors);
    const name =
      errorsvalues[0]?.ref?.name ||
      Object.values(errorsvalues[0])?.[0]?.ref?.name;
    if (errorsvalues.length > 0) {
      const firstErrorElement = document.getElementsByName(name)[0];
      firstErrorElement?.scrollIntoView({
        behavior: `smooth`,
        block: 'center',
      });
    }
  }
}
