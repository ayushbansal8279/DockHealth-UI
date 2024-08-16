export const customPromptBuilder = (prompt) => {
  return {
    customPrompt: prompt,
    persona: '',
    tone: '',
  };
};

export const SummaryType = {
  PATIENT: 'PATIENT',
  TASK: 'TASK',
  WORKFLOW: 'WORKFLOW',
};
