/* eslint-disable import/prefer-default-export */
import { SHOW_COLUMNS_CONFIG } from 'helpers/task-helpers';

export const limitToConfigurableKeys = dataToLimit =>
  dataToLimit.filter(c => SHOW_COLUMNS_CONFIG[c.identifier]);
