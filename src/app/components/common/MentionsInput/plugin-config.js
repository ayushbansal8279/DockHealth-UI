import createMentionPlugin from 'draft-js-mention-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
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
    // supportWhitespace: true,
    mentionComponent: PeopleMention,
    positionSuggestions: props => {
      const { innerHeight: windowHeight, innerWidth: windowWidth } = window;

      // calculate from right side because of task drawer fixed position
      const rightPosition = windowWidth - props.decoratorRect.left - 244;

      const styles = {
        position: 'fixed',
        right: rightPosition < 8 ? 8 : rightPosition,
        left: 'auto',
        width: 252,
        zIndex: 1001,
      };

      if (windowHeight - props.decoratorRect.top < 300) {
        styles.transform = `translateY(-100%) translateY(-${props.decoratorRect
          .height + 5}px)`;
      }

      return styles;
    },
  });

export const initializePatientMentionPlugin = () =>
  createMentionPlugin({
    mentionPrefix: '#',
    mentionTrigger: '#',
    mentionComponent: PatientMention,
    // supportWhitespace: true,
    positionSuggestions: props => {
      const { innerHeight: windowHeight, innerWidth: windowWidth } = window;

      // calculate from right side because of task drawer fixed position
      const rightPosition = windowWidth - props.decoratorRect.left - 309;

      const styles = {
        position: 'fixed',
        right: rightPosition < 8 ? 8 : rightPosition,
        left: 'auto',
        width: 317,
        zIndex: 1001,
      };

      if (windowHeight - props.decoratorRect.top < 300) {
        styles.transform = `translateY(-100%) translateY(-${props.decoratorRect
          .height + 5}px)`;
      }

      return styles;
    },
  });
