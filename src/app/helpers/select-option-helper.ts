import { ISelectOption } from '../types/gender';

export const getValueLabelHashFromOptions = (options: ISelectOption[]) => {
  const res: Record<string, string | number> = {};

  for (const option of options) {
    res[option.value] = option.label;
  }

  return res;
};
