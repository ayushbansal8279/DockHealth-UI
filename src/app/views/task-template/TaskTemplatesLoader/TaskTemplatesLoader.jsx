import React from 'react';
import { TaskTemplateLoader } from './styled';

const TaskTemplatesLoader = () => {
  return (
    <>
      {new Array(4).fill().map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <TaskTemplateLoader key={index} />
      ))}
    </>
  );
};

export default TaskTemplatesLoader;
