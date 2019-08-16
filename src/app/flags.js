import { createFlags } from 'flag';

const flags = {
  features: {
    showTasksInPatientDrawer: true,
  },
};

export const {
  FlagsProvider, Flag, useFlag, useFlags,
} = createFlags();

export default flags;
