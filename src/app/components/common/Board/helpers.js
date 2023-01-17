export const quickTaskInputValidator = value => {
  if ([...value]?.filter(char => char !== ' ').length < 2)
    return 'The task description is too short (min. 2 characters)';

  return null;
};
