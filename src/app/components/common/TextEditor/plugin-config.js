import createMentionPlugin from 'draft-js-mention-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import PeopleMention from './PeopleMention/PeopleMention';
import PatientMention from './PatientMention/PatientMention';
import EditorLink from './EditorLink/EditorLink';

export const initializeLinkifyPlugin = () =>
  createLinkifyPlugin({
    target: '_blank',
    component: EditorLink,
  });

export const initializePeopleMentionPlugin = () =>
  createMentionPlugin({
    mentionPrefix: '@',
    mentionTrigger: '@',
    mentionComponent: PeopleMention,
  });

export const initializePatientMentionPlugin = () =>
  createMentionPlugin({
    mentionPrefix: '#',
    mentionTrigger: '#',
    mentionComponent: PatientMention,
  });

export const initializeStaticToolbarPlugin = () => createToolbarPlugin();
