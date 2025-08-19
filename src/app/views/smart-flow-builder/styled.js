import styled from 'styled-components';
import palette from '@/app/styles/palette';
import BoltIcon from '@mui/icons-material/Bolt';

export const ContextMenu = styled.div`
  position: absolute;
  left: 20px;
  top: 20px;
  height: 270px;
  width: 160px;
  padding: 16px;
  background-color: ${palette.white};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  z-index: 10;
`;

export const ElementsSidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  height: 100vh;
  background: white;
  border-right: 1px solid ${palette.lightGrayishBlue};
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
`;

export const SidebarHeader = styled.div`
  padding: 24px 20px 16px;
  border-bottom: 1px solid ${palette.lightGrayishBlue};
  background: linear-gradient(
    135deg,
    ${palette.aliceBlue} 0%,
    ${palette.whiteSmoke} 100%
  );
`;

export const SidebarTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: ${palette.gunmetal};
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '🚀';
    font-size: 20px;
  }
`;

export const SidebarSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${palette.coolGrey10};
  font-weight: 400;
`;

export const SidebarContent = styled.div`
  padding: 20px;
  flex: 1;
`;

export const CategorySection = styled.div`
  margin-bottom: 32px;
`;

export const CategoryTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${palette.coolGrey10};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ElementButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid ${palette.lightGrayishBlue};
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    border-color: ${palette.azureBlue};
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }
`;

export const ElementIconBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  font-size: 18px;
  color: white;
  flex-shrink: 0;

  &.task,
  &.automation,
  &.decision,
  &.workflow,
  &.utility {
    background: linear-gradient(
      45deg,
      ${palette.blueOcean},
      ${palette.purplePassion}
    );
  }
  &.email,
  &.webhook,
  &.api,
  &.sms,
  &.patient,
  &.appointment,
  &.note {
    background: linear-gradient(
      45deg,
      ${palette.dirtyBanana},
      ${palette.orangeJulius}
    );
  }
  &.ai,
  &.ai-assistant {
    background: linear-gradient(
      45deg,
      ${palette.tomatoInYoFace},
      ${palette.oPlusRed}
    );
  }
`;

export const ElementInfo = styled.div`
  flex: 1;
`;

export const ElementTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${palette.gunmetal};
  margin-bottom: 2px;
`;

export const ElementDescription = styled.div`
  font-size: 12px;
  color: ${palette.coolGrey10};
  line-height: 1.4;
`;

export const TaskElementIcon = styled.div`
  width: 18px;
  height: 12px;
  border: 2px solid white;
  border-radius: 3px;
`;

export const AutomationTaskIcon = styled(BoltIcon)`
  font-size: 20px !important;
`;

export const BuilderHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: white;
  border-bottom: 1px solid ${palette.lightGrayishBlue};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 10;
  user-select: none;
`;

export const HeaderBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

export const HeaderTitle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ $isActive }) =>
    $isActive ? palette.azureBlue : palette.gunmetal};
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${palette.aliceBlue};
    border-color: ${palette.lightGrayishBlue};
  }
`;

export const EditIconWrapper = styled.div`
  opacity: 0;
  color: ${palette.coolGrey1};
  transition: opacity 0.2s ease;

  ${HeaderTitle}:hover & {
    opacity: 1;
  }
`;

export const BuilderHeaderText = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  color: ${({ color }) => color || palette.coolGrey10};

  &:hover {
    text-decoration: underline;
    ${EditIconWrapper} {
      opacity: 1;
    }
  }

  &:last-of-type {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const SidebarDivider = styled.hr`
  border: none;
  height: 1px;
  background: ${palette.lightGrayishBlue};
  margin: 24px 0;
`;

export const AutoAlignButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${palette.azureBlue};
  border-radius: 8px;
  background: linear-gradient(
    45deg,
    ${palette.azureBlue},
    ${palette.azureBlue}
  );
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const UtilitySection = styled.div`
  padding: 20px;
  border-top: 1px solid ${palette.lightGrayishBlue};
  background: ${palette.aliceBlue};
`;

export const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  background: linear-gradient(
    135deg,
    ${palette.aliceBlue} 0%,
    ${palette.whiteSmoke} 100%
  );
  padding-top: 64px;
`;
