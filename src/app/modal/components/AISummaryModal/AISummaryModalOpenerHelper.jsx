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
const AISummaryModalOpenerHelper = ({ type, title, identifier }) => {
  const [isAiIconHovered, setAiIconHovered] = useState(false);
  const dispatch = useDispatch();
  console.log('identifier', identifier);

  const methodToCall = async () => {
    if (type === 'Patient') return await getPatientAISummary(identifier);
    if (type === 'Task') return await getTaskAISummary(identifier);
    if (type === 'Workflow') return await getWorkflowAISummary(identifier);
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
              onsubmit: async () => await methodToCall(),
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
