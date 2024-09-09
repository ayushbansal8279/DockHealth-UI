import { useState } from 'react';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import LuminaStar from '@/app/img/AI/LuminaStar';
import palette from '@/app/styles/palette';
import {
  getPatientAISummary,
  getTaskAISummary,
  getWorkflowAISummary,
} from '@/app/api/ai-summary-api';
import { openModal } from '../../actions';
import { useDispatch } from 'react-redux';
import { customPromptBuilder, SummaryType } from '@/app/helpers/ai-helper';

const AISummaryModalOpenerHelper = ({ type, title, identifier }) => {
  const [isAiIconHovered, setAiIconHovered] = useState(false);
  const dispatch = useDispatch();

  const methodToCall = async (promptText, forceRefresh) => {
    const customPrompt = customPromptBuilder(promptText, forceRefresh);

    if (type === SummaryType.PATIENT)
      return await getPatientAISummary(identifier, customPrompt);
    if (type === SummaryType.TASK)
      return await getTaskAISummary(identifier, customPrompt);
    if (type === SummaryType.WORKFLOW)
      return await getWorkflowAISummary(identifier, customPrompt);
  };

  return (
    <Tooltip placement="top" title="AI Summary">
      <div
        onMouseEnter={() => setAiIconHovered(true)}
        onMouseLeave={() => setAiIconHovered(false)}
        onClick={() =>
          dispatch(
            openModal('AISummary', {
              type: type,
              title: `${title}`,
              onsubmit: async (promptText, forceRefresh) =>
                await methodToCall(promptText, forceRefresh),
            }),
          )
        }
      >
        <LuminaStar
          color={
            isAiIconHovered ? palette.newBrightBlue : palette.lightGrayishBlue
          }
        />
      </div>
    </Tooltip>
  );
};

export default AISummaryModalOpenerHelper;
