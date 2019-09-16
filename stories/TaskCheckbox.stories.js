import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TaskCheckbox from '../src/app/components/TaskCheckbox';


storiesOf('TaskCheckbox', module)
  .add('unchecked', () => <TaskCheckbox />)
  .add('checked', () => <TaskCheckbox checked />);
