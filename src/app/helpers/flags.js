import { createFlags } from 'flag';

const flags = {
  features: {
    showTasksInPatientDrawer: true,
    showOldPatientDetails: false,
  },
};

export const { FlagsProvider, Flag, useFlag, useFlags } = createFlags();

export default flags;
