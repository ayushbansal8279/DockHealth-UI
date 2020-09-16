import moment from 'moment';

export const SUGGESTIONS_PLACEHOLDER = {
  name: '',
  id: '',
  type: 'DEFAULT',
};

export const getFormattedAge = ({ dob }) => {
  if (!dob) {
    return '';
  }

  const yearsOld = moment().diff(moment(dob), 'years');

  if (yearsOld < 0) {
    return '';
  }

  const yearsLabel = yearsOld === 1 ? 'yr' : 'yrs';

  return `${yearsOld} ${yearsLabel}`;
};

export const mapPatientsToSuggestions = patients =>
  patients.map(({ patientIdentifier, firstName, lastName, dob, mrn }) => ({
    id: patientIdentifier,
    name: `${firstName} ${lastName}`,
    age: getFormattedAge({ dob }),
    mrn,
  }));

export const mapPeopleToSuggestions = people =>
  people.map(person => ({
    ...person,
    id: person.userIdentifier,
    name: person.userName,
  }));

export const peopleSuggestionsFilter = (value, people) =>
  people.filter(({ name }) =>
    name.toLowerCase().startsWith(value.toLowerCase()),
  );
