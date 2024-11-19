import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import LuminaStar from '@/app/img/AI/LuminaStar';
import palette from '@/app/styles/palette';
import {
  getPatientAISummary,
  getTaskAISummary,
  getWorkflowAISummary,
} from '@/app/api/ai-summary-api';
import { openModal } from '../../actions';
import { aiSummaryRequestBuilder, SummaryType } from '@/app/helpers/ai-helper';

const AISummaryModalOpenerHelper = ({ type, title, identifier }) => {
  const [isAiIconHovered, setAiIconHovered] = useState(false);
  const dispatch = useDispatch();

  const generateAISummary = async (force, persona, customPrompt) => {
    const requestPayload = aiSummaryRequestBuilder(
      force,
      persona,
      customPrompt,
    );

    if (type === SummaryType.PATIENT)
      return getPatientAISummary(identifier, requestPayload);
    if (type === SummaryType.TASK)
      return getTaskAISummary(identifier, requestPayload);
    if (type === SummaryType.WORKFLOW)
      return getWorkflowAISummary(identifier, requestPayload);
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
              identifier: identifier,
              onsubmit: async (promptText, forceRefresh) =>
                await generateAISummary(promptText, forceRefresh),
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
