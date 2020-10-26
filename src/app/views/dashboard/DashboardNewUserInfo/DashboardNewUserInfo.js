import React from 'react';
import { Wrapper, Section, Title, Description } from './styled';

const DashboardNewUserInfo = () => {
  return (
    <Wrapper>
      <Section>
        <Title>Quickly add a new task</Title>
        <Description>
          You can add a new task quickly and easily. Simply type in your task in
          the new box with “+&nbsp;Add&nbsp;Task,” hit the enter key and the new
          task is saved to your list.
        </Description>
      </Section>
      <Section>
        <Title>A place to call Home</Title>
        <Description>
          The Home page gives you the ability to view all of your to-dos, across
          all of your lists, on a single page.
        </Description>
      </Section>
      <Section>
        <Title>We’ve organized for you</Title>
        <Description>
          Your Home screen only shows the tasks assigned to you. Today, it’s
          organized by due date: Today, Next 7 days and My Tasks. If there
          aren’t assigned due dates, your view will just show My Tasks.
        </Description>
      </Section>
    </Wrapper>
  );
};

export default DashboardNewUserInfo;
