import createMentionPlugin from 'draft-js-mention-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import PeopleMention from './PeopleMention/PeopleMention';
import PatientMention from './PatientMention/PatientMention';
import EditorLink from './EditorLink/EditorLink';

export const linkifyPluginConfig = createLinkifyPlugin({
  target: '_blank',
  component: EditorLink,
});

export const peopleMentionPluginConfig = createMentionPlugin({
  mentionPrefix: '@',
  mentionTrigger: '@',
  // supportWhitespace: true,
  mentionComponent: PeopleMention,
  positionSuggestions: props => {
    const { innerHeight: windowHeight, innerWidth: windowWidth } = window;

    // calculate from right side because of task drawer fixed position
    const rightPosition = windowWidth - props.decoratorRect.left - 244;

    let topPosition;
    let bottomPosition;

    if (windowHeight / props.decoratorRect.top < 2) {
      topPosition = 'auto';
      bottomPosition = windowHeight - props.decoratorRect.top + 5;
    } else {
      topPosition = props.decoratorRect.bottom + 5;
      bottomPosition = 'auto';
    }

    return {
      position: 'fixed',
      right: rightPosition < 8 ? 8 : rightPosition,
      left: 'auto',
      bottom: bottomPosition,
      top: topPosition,
      width: 252,
      zIndex: 1001,
    };
  },
});

export const patientMentionPluginConfig = createMentionPlugin({
  mentionPrefix: '#',
  mentionTrigger: '#',
  mentionComponent: PatientMention,
  // supportWhitespace: true,
  positionSuggestions: props => {
    const { innerHeight: windowHeight, innerWidth: windowWidth } = window;

    // calculate from right side because of task drawer fixed position
    const rightPosition = windowWidth - props.decoratorRect.left - 309;

    let topPosition;
    let bottomPosition;

    if (windowHeight / props.decoratorRect.top < 2) {
      topPosition = 'auto';
      bottomPosition = windowHeight - props.decoratorRect.top + 5;
    } else {
      topPosition = props.decoratorRect.bottom + 5;
      bottomPosition = 'auto';
    }

    return {
      position: 'fixed',
      right: rightPosition < 8 ? 8 : rightPosition,
      left: 'auto',
      bottom: bottomPosition,
      top: topPosition,
      width: 317,
      zIndex: 1001,
    };
  },
});
