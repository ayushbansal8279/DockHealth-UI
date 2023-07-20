import { SHOW_COLUMNS_CONFIG } from 'helpers/task-helpers';

export const limitToConfigurableKeys = (dataToLimit) =>
  dataToLimit.filter((c) => SHOW_COLUMNS_CONFIG[c.identifier]);
