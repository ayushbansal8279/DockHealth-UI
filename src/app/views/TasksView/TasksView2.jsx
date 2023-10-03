import React from 'react';
import Virtualized from './Virtualized/Virtualized';
import cx from './TasksView.module.scss';

function View({ children }) {
  return <main className={cx.View2}>{children}</main>;
}

export default function TasksView2() {
  return (
    <View>
      <Virtualized />
    </View>
  );
}
