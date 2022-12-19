export const Category = {
  TASK_OTHER: 'TASK_OTHER',
  TASK_CORE: 'TASK_CORE',
};

export const CategoryLabel = {
  [Category.TASK_CORE]: 'Core',
  [Category.TASK_OTHER]: 'Other Info',
};

export const CATEGORY_OPTIONS = [
  {
    label: CategoryLabel[Category.TASK_OTHER],
    value: Category.TASK_OTHER,
  },
  {
    label: CategoryLabel[Category.TASK_CORE],
    value: Category.TASK_CORE,
  },
];
