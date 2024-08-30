export const customPromptBuilder = (prompt, refresh) => {
  const customPrompt = prompt || '';
  const forceRefresh = refresh || false;

  return {
    customPrompt: customPrompt,
    persona: '',
    tone: '',
    force: forceRefresh,
  };
};

export const SummaryType = {
  PATIENT: 'PATIENT',
  TASK: 'TASK',
  WORKFLOW: 'WORKFLOW',
};
