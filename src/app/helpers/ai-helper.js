export const aiSummaryRequestBuilder = (
  promptTypeValue,
  customPrompTest,
  forceRefresh = false,
) => {
  const customPrompt = customPrompTest || '';

  return {
    customPrompt,
    persona: promptTypeValue,
    tone: '',
    force: forceRefresh,
  };
};

export const SummaryType = {
  PATIENT: 'PATIENT',
  TASK: 'TASK',
  WORKFLOW: 'WORKFLOW',
};
