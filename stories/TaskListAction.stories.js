import React from 'react';
import { storiesOf } from '@storybook/react';
import PrintIcon from '../src/app/img/print.svg';
import SlimViewIcon from '../src/app/img/slim-view.svg';
import NotificationsOffIcon from '../src/app/img/notifications-off.svg';
import NotificationsOnIcon from '../src/app/img/notifications-on.svg';
import TaskListAction from '../src/app/components/TaskListAction';
import { action } from '@storybook/addon-actions';

storiesOf('TaskListAction', module)
  .add('text', () => <TaskListAction>Sample</TaskListAction>);

storiesOf('TaskListAction/Icon', module)
  .add('print', () => (
    <TaskListAction icon={PrintIcon} alt="Print" onClick={action('clicked')}>
      Print
    </TaskListAction>
  ))
  .add('slim view', () => (
    <TaskListAction icon={SlimViewIcon} alt="Toggle slim view" onClick={action('clicked')}>
      Slim view
    </TaskListAction>
  ))
  .add('notifications disabled', () => (
    <TaskListAction icon={NotificationsOffIcon} alt="Enable notifications" onClick={action('clicked')}>
      Notifications: off
    </TaskListAction>
  ))
  .add('notifications enabled', () => (
    <TaskListAction icon={NotificationsOnIcon} alt="Disable notifications" onClick={action('clicked')}>
      Notifications: on
    </TaskListAction>
  ));
