import ELK from 'elkjs/lib/elk.bundled';
import palette from '../styles/palette';

export const TASK_NODE_WIDTH = 320;

export const NodeType = {
  NEW_AUTOMATION: 'NEW_AUTOMATION',
  NEW_STANDARD: 'NEW_STANDARD',
  NEW_DECISION: 'NEW_DECISION',
  STANDARD: 'STANDARD',
  DECISION: 'DECISION',
  NEW_WORKFLOW_LINK: 'NEW_WORKFLOW_LINK',
  WORKFLOW_LINK: 'WORKFLOW_LINK',
  START_INDICATOR: 'INDICATOR',
  END_INDICATOR: 'INDICATOR',
  NEW_EMAIL: 'NEW_EMAIL',
  NEW_SEND_SMS: 'NEW_SEND_SMS',
  NEW_WEBHOOK: 'NEW_WEBHOOK',
  NEW_CALL_API: 'NEW_CALL_API',
  NEW_CREATE_PATIENT: 'NEW_CREATE_PATIENT',
  NEW_CREATE_APPOINTMENT: 'NEW_CREATE_APPOINTMENT',
  NEW_UPDATE_APPOINTMENT: 'NEW_UPDATE_APPOINTMENT',
  NEW_CREATE_NOTE: 'NEW_CREATE_NOTE',
  NEW_AI_ANALYZER: 'NEW_AI_ANALYZER',
  NEW_AI_ASSISTANT: 'NEW_AI_ASSISTANT',
  NEW_DOCUMENT_PARSING_AGENT: 'NEW_DOCUMENT_PARSING_AGENT',
  NEW_ELIGIBILITY_AGENT: 'NEW_ELIGIBILITY_AGENT',
  NEW_MEDICAL_RECORD_GATHERING_AGENT: 'NEW_MEDICAL_RECORD_GATHERING_AGENT',
  NEW_MISSING_RECORDS_AGENT: 'NEW_MISSING_RECORDS_AGENT',
  NEW_VOICE_AGENT: 'NEW_VOICE_AGENT',
};

export const LinkType = {
  INDICATOR: 'INDICATOR_LINK',
  STANDARD: 'STANDARD_LINK',
  DECISION: 'DECISION_LINK',
  TEMPORARY: 'TEMPORARY_LINK',
  TEMPORARY_DECISION: 'TEMPORARY_DECISION_LINK',
};

export const NodeSourceHandle = {
  SOURCE_A: 'SOURCE_A',
  SOURCE_B: 'SOURCE_B',
  SOURCE_C: 'SOURCE_C',
};

export const NodeTargetHandle = {
  TARGET_A: 'TARGET_A',
  TARGET_B: 'TARGET_B',
  TARGET_C: 'TARGET_C',
  TARGET_D: 'TARGET_D',
};

export function getUniqueLinkId(sourceId, targetId) {
  return `${sourceId}_${targetId}`;
}

export function createLinkElement(
  type,
  sourceId,
  targetId,
  sourceHandle,
  targetHandle,
  indicatorType,
) {
  if (sourceId === targetId && indicatorType === 'START_INDICATOR') {
    sourceId = 'START_INDICATOR';
  }
  if (sourceId === targetId && indicatorType === 'END_INDICATOR') {
    targetId = 'END_INDICATOR';
  }
  return {
    id: getUniqueLinkId(sourceId, targetId),
    source: sourceId,
    target: targetId,
    sourceHandle: sourceHandle || NodeSourceHandle.SOURCE_A,
    targetHandle: targetHandle || NodeTargetHandle.TARGET_A,
    type,
    data: {},
    indicatorType,
  };
}

export function createTemporaryTaskNode(
  currentTemporaryElements,
  elementPosition,
  type = NodeType.NEW_STANDARD,
) {
  const numberOfNewTasks =
    currentTemporaryElements?.filter((element) => element.type === type)
      .length || 0;

  return {
    id: `${type}-${numberOfNewTasks}`,
    type,
    position: elementPosition,
  };
}

export function createEmailNode(currentTemporaryElements, elementPosition) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_EMAIL,
    ).length || 0;

  return {
    id: `NEW_EMAIL-${numberOfNewNodes}`,
    type: 'NEW_EMAIL',
    position: elementPosition,
    data: {
      label: 'Send Email',
      subject: '',
      recipients: [],
      status: 'Ready',
    },
  };
}

export function createWebhookNode(currentTemporaryElements, elementPosition) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === 'NEW_WEBHOOK',
    ).length || 0;

  return {
    id: `NEW_WEBHOOK-${numberOfNewNodes}`,
    type: 'NEW_WEBHOOK',
    position: elementPosition,
    data: {
      label: 'Webhook',
      url: '',
      method: 'POST',
      status: 'Ready',
    },
  };
}

export function createAIAnalyzerNode(
  currentTemporaryElements,
  elementPosition,
) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === 'NEW_AI_ANALYZER',
    ).length || 0;

  return {
    id: `NEW_AI_ANALYZER-${numberOfNewNodes}`,
    type: 'NEW_AI_ANALYZER',
    position: elementPosition,
    data: {
      label: 'AI Analyzer',
      model: 'GPT-4',
      analysisType: 'Text Analysis',
      status: 'AI Ready',
    },
  };
}

export function createAIAssistantNode(
  currentTemporaryElements,
  elementPosition,
) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === 'NEW_AI_ASSISTANT',
    ).length || 0;

  return {
    id: `NEW_AI_ASSISTANT-${numberOfNewNodes}`,
    type: 'NEW_AI_ASSISTANT',
    position: elementPosition,
    data: {
      label: 'AI Assistant',
      capability: 'General',
      persona: 'Professional',
      status: 'Assistant Ready',
    },
  };
}

export function createDocumentParsingAgentNode(
  currentTemporaryElements,
  elementPosition,
) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_DOCUMENT_PARSING_AGENT,
    ).length || 0;

  return {
    id: `NEW_DOCUMENT_PARSING_AGENT-${numberOfNewNodes}`,
    type: NodeType.NEW_DOCUMENT_PARSING_AGENT,
    position: elementPosition,
    data: {
      label: 'Document Parsing Agent',
      capability: 'Document Analysis',
      persona: 'Document Specialist',
      status: 'Agent Ready',
    },
  };
}

export function createEligibilityAgentNode(
  currentTemporaryElements,
  elementPosition,
) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_ELIGIBILITY_AGENT,
    ).length || 0;

  return {
    id: `NEW_ELIGIBILITY_AGENT-${numberOfNewNodes}`,
    type: NodeType.NEW_ELIGIBILITY_AGENT,
    position: elementPosition,
    data: {
      label: 'Eligibility Agent',
      capability: 'Eligibility Verification',
      persona: 'Benefits Specialist',
      status: 'Agent Ready',
    },
  };
}

export function createMedicalRecordGatheringAgentNode(
  currentTemporaryElements,
  elementPosition,
) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_MEDICAL_RECORD_GATHERING_AGENT,
    ).length || 0;

  return {
    id: `NEW_MEDICAL_RECORD_GATHERING_AGENT-${numberOfNewNodes}`,
    type: NodeType.NEW_MEDICAL_RECORD_GATHERING_AGENT,
    position: elementPosition,
    data: {
      label: 'Medical Record Gathering Agent',
      capability: 'Record Collection',
      persona: 'Medical Records Specialist',
      status: 'Agent Ready',
    },
  };
}

export function createMissingRecordsAgentNode(
  currentTemporaryElements,
  elementPosition,
) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_MISSING_RECORDS_AGENT,
    ).length || 0;

  return {
    id: `NEW_MISSING_RECORDS_AGENT-${numberOfNewNodes}`,
    type: NodeType.NEW_MISSING_RECORDS_AGENT,
    position: elementPosition,
    data: {
      label: 'Missing Records Agent',
      capability: 'Record Gap Analysis',
      persona: 'Records Auditor',
      status: 'Agent Ready',
    },
  };
}

export function createVoiceAgentNode(
  currentTemporaryElements,
  elementPosition,
) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_VOICE_AGENT,
    ).length || 0;

  return {
    id: `NEW_VOICE_AGENT-${numberOfNewNodes}`,
    type: NodeType.NEW_VOICE_AGENT,
    position: elementPosition,
    data: {
      label: 'Voice Call AI Agent',
      capability: 'Voice Communication',
      persona: 'Voice Assistant',
      status: 'Agent Ready',
    },
  };
}

export function createSendSMSNode(currentTemporaryElements, elementPosition) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_SEND_SMS,
    ).length || 0;

  return {
    id: `NEW_SEND_SMS-${numberOfNewNodes}`,
    type: NodeType.NEW_SEND_SMS,
    position: elementPosition,
    data: {
      label: 'Send SMS',
      message: '',
      recipients: [],
      status: 'Ready',
    },
  };
}


export function createCallAPINode(currentTemporaryElements, elementPosition) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_CALL_API,
    ).length || 0;

  return {
    id: `NEW_CALL_API-${numberOfNewNodes}`,
    type: NodeType.NEW_CALL_API,
    position: elementPosition,
    data: {
      label: 'Call API',
      endpoint: '',
      method: 'GET',
      status: 'Ready',
    },
  };
}

export function createCreatePatientNode(currentTemporaryElements, elementPosition) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_CREATE_PATIENT,
    ).length || 0;

  return {
    id: `NEW_CREATE_PATIENT-${numberOfNewNodes}`,
    type: NodeType.NEW_CREATE_PATIENT,
    position: elementPosition,
    data: {
      label: 'Create Patient',
      patientData: {},
      status: 'Ready',
    },
  };
}

export function createCreateAppointmentNode(currentTemporaryElements, elementPosition) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_CREATE_APPOINTMENT,
    ).length || 0;

  return {
    id: `NEW_CREATE_APPOINTMENT-${numberOfNewNodes}`,
    type: NodeType.NEW_CREATE_APPOINTMENT,
    position: elementPosition,
    data: {
      label: 'Create Appointment',
      appointmentData: {},
      status: 'Ready',
    },
  };
}

export function createUpdateAppointmentNode(currentTemporaryElements, elementPosition) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_UPDATE_APPOINTMENT,
    ).length || 0;

  return {
    id: `NEW_UPDATE_APPOINTMENT-${numberOfNewNodes}`,
    type: NodeType.NEW_UPDATE_APPOINTMENT,
    position: elementPosition,
    data: {
      label: 'Update Appointment',
      appointmentData: {},
      status: 'Ready',
    },
  };
}

export function createCreateNoteNode(currentTemporaryElements, elementPosition) {
  const numberOfNewNodes =
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_CREATE_NOTE,
    ).length || 0;

  return {
    id: `NEW_CREATE_NOTE-${numberOfNewNodes}`,
    type: NodeType.NEW_CREATE_NOTE,
    position: elementPosition,
    data: {
      label: 'Create Note',
      noteData: {},
      status: 'Ready',
    },
  };
}

export function createTemporaryOptionsForDecisionTask(
  currentTemporaryElements,
  decisionTaskId,
  decisionTaskPosition,
) {
  const firstTemporaryStandardTask = createTemporaryTaskNode(
    currentTemporaryElements,
    {
      x: decisionTaskPosition.x - 200,
      y: decisionTaskPosition.y + 300,
    },
  );

  const secondTemporaryStandardTask = createTemporaryTaskNode(
    [firstTemporaryStandardTask, ...(currentTemporaryElements || [])],
    {
      x: decisionTaskPosition.x + 200,
      y: decisionTaskPosition.y + 300,
    },
  );

  return [
    firstTemporaryStandardTask,
    secondTemporaryStandardTask,
    createLinkElement(
      LinkType.TEMPORARY_DECISION,
      decisionTaskId,
      firstTemporaryStandardTask.id,
    ),
    createLinkElement(
      LinkType.TEMPORARY_DECISION,
      decisionTaskId,
      secondTemporaryStandardTask.id,
    ),
  ];
}

export function createDecisionTaskNodes(
  currentTemporaryElements,
  elementPosition,
) {
  const newDecisionTaskId = `${NodeType.NEW_DECISION}-${
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_DECISION,
    ).length || 0
  }`;

  const temporaryDecisionTask = {
    id: newDecisionTaskId,
    type: NodeType.NEW_DECISION,
    position: elementPosition,
  };

  return [
    temporaryDecisionTask,
    ...createTemporaryOptionsForDecisionTask(
      currentTemporaryElements,
      temporaryDecisionTask.id,
      temporaryDecisionTask.position,
    ),
  ];
}

export function createNewAutomationTaskNode(
  currentTemporaryElements,
  elementPosition,
  type = NodeType.NEW_AUTOMATION,
) {
  const numberOfNewTasks =
    currentTemporaryElements?.filter((element) => element.type === type)
      .length || 0;
  return {
    id: `${type}-${numberOfNewTasks}`,
    type,
    position: elementPosition,
  };
}

export function getTargetNodeType(sourceElementType) {
  if (sourceElementType === NodeType.NEW_DECISION) return NodeType.DECISION;

  return NodeType.STANDARD;
}

export async function getAutoLayout(tasks, startX = 0, startY = 0) {
  const elk = new ELK();

  const nodes = [];
  const edges = [];

  for (const { identifier, taskLinks } of tasks) {
    nodes.push({ id: identifier, width: 230, height: 130 });

    // eslint-disable-next-line no-unused-expressions
    if (taskLinks)
      for (const { sourceTaskIdentifier, targetTaskIdentifier } of taskLinks) {
        if (
          tasks.some(({ identifier: id }) => sourceTaskIdentifier === id) &&
          tasks.some(({ identifier: id }) => targetTaskIdentifier === id)
        ) {
          edges.push({
            id: getUniqueLinkId(sourceTaskIdentifier, targetTaskIdentifier),
            sources: [sourceTaskIdentifier],
            targets: [targetTaskIdentifier],
          });
        }
      }
  }

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.direction': 'DOWN',
      'elk.algorithm': 'mrtree',
      separateConnectedComponents: false,
      'elk.padding': '[left=0, top=0, right=0, bottom=0]',
      'spacing.nodeNode': 200,
      'spacing.nodeNodeBetweenLayers': 200,
    },
    children: nodes,
    edges,
  };

  const { children } = await elk.layout(graph);

  return children.map(({ id, x, y }) => ({
    id,
    position: {
      x: x + startX,
      y: y + startY,
    },
  }));
}

export function getMiniMapNodeColor(node) {
  const nodeType = node?.type;

  switch (nodeType) {
    case NodeType.NEW_AUTOMATION:
      return palette.purple;
    case NodeType.NEW_STANDARD:
      return palette.lightSkyBlue;
    case NodeType.NEW_DECISION:
      return palette.orange;
    case NodeType.STANDARD:
      return palette.blueOcean;
    case NodeType.DECISION:
      return palette.brightOrange;
    case NodeType.NEW_WORKFLOW_LINK:
      return palette.cyanBlue;
    case NodeType.WORKFLOW_LINK:
      return palette.darkBlue;
    case NodeType.START_INDICATOR:
    case NodeType.END_INDICATOR:
      return palette.green;
    default:
      return palette.lightGrey;
  }
}
