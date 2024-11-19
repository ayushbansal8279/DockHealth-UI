export const aiSummaryRequestBuilder = (force, persona, customPrompt = '') => {
  return {
    customPrompt,
    force,
    persona,
    tone: '',
  };
};

export const SummaryType = {
  PATIENT: 'PATIENT',
  TASK: 'TASK',
  WORKFLOW: 'WORKFLOW',
};
