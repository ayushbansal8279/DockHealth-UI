import { Grid, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Highlighter from 'react-highlight-words';
import styled from 'styled-components';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import Search from 'components/task-view/Search/Search';

const faqArticles = [
  {
    title: 'What if I don’t want the CDC Protocols?',
    content: `You are free as an organization owner/administrator to remove any list. Simply click on the 3 dots on the right hand side of any list name on the list page. You can then either delete or edit a list.`,
  },
  {
    title: 'How can I add patient context to a task?',
    content: `For each task in Dock, a patient can be linked so that each task or subtask has patient context. Adding a patient is easy and can be done by simply searching or selecting an existing patient form the Dock directory or creating a new patient profile. A new patient profile can be created in the process of creating a task or created in the patient page. Adding patient context to a task offers many benefits including, easy access to contact information for calling a patient back (especially in the mobile app) and being able to see all the tasks for a patient across all of your lists. You can also create short notes in the patient profile for little reminders and “one-liners” on a patient.`,
  },
  {
    title: 'Can I add attachments to a task in Dock?',
    content: `Attachments can now be added to every task and subtask. Examples of attachments include PDFs, images, word documents, audio files and other important items. These attachments are stored securely. and are also HIPAA compliant. You can easily preview most items such as PDFs, audio files and images by clicking on the file or choose to download the file to your computer. Please ensure that the files are downloaded to a secure device.`,
  },
  {
    title: 'How can I add more people to my Dock account?',
    content: `As an administrator of an organization, you can invite new users and remove users at any time. Their subscription and fees will be updated at the beginning of the subsequent calendar month.`,
  },
  {
    title: 'Can I use Dock with colleagues outside of our practice?',
    content: `We think Dock provides a powerful collaborative platform to help providers from within and across organizations work better together for superlative patient care. You are free to invite whomever you would like from within and outside your organization. Having said this, Dock health is a HIPAA compliant application. In order to use Dock you will sign a Business Associate Agreement (BAA) as a covered entity and agreed to our End User License Agreement (EULA), Privacy Statement and Terms of Service. As an owner of an organization you will want to ensure that privacy and security measures are in place such as ensuring all users are known and have been trained on HIPAA. Your organizations may consider data sharing agreements and other safeguards to ensure patient data is protected and secure across users and devices.`,
  },
  {
    title: 'Does Dock integrate with the EHR (Electronic Health Record)?',
    content: `We do, but we'd ask you if you really need it. We think Dock is awesome for a bunch of reasons, one of which is that it's super easy to use and doesn't require any EHR integration. You can be up and running with Dock in less than 5 mins which is powerful in the crazy busy world of patient care and practice management. Dock replaces a lot of the administrative stuff that happens over email, Post-it Notes and often falls through the cracks. We think of ourselves as the connective tissue between the clinical stuff and the administrative stuff that needs to magically happen for the rest to matter. While EHR integration is awesome, most practices don't need it. That results is a more affordable and faster setup for you and your practice. Contact us at support@dock.health to learn more about our Custom/Enterprise offerings and EHR integration.`,
  },
  {
    title: 'How does Dock email integration work?',
    content: `Since so much of what is actually needed for reliable and quality patient care happens over email, we've worked hard to make email integration as seamless and valuable as possible. Simply forward any email from the email account that you've used to sign up for Dock to Task@DockHealth.Email and we'll automagically turn it into a task. The subject line of your email will become the task and we'll include the body of the email and any attachments in your Dock inbox. See below for more advanced features such as sending tasks to lists, assigning tasks and setting due dates.`,
  },
  {
    title:
      'How can I do some of those advanced moves for creating tasks from emails?',
    content: `We offer a number of shortcuts to get emails into Dock easily. These features including sending emails directly into a list, assigning a user, setting a due date and flagging as high priority. Simply add any or all of the following shortcuts below to the subject line of the email you forward or send to Task@DockHealth.Email.
#ListName = add the list name after # and send it directly to that list
@FirstLast = assign the task to a user within a list (user must be a member of this list, e.g. @ElonMusk)
*HIGH = add a flag to make this task a high priority
!Date = add a due date to a task (e.g. !2/28/20)
`,
  },
  {
    title: 'What if we want to customize things like automated emails in Dock?',
    content: `We've helped many practices automate common practices through email integration and automation. To think of this simply, if there are emails that come in from a particular individual or service that we can identify by the email address or subject line, we can help automate a workflow in Dock. An example is you have an email that comes to your inbox for new patients that are requesting services, you somehow have to capture and track that. With Dock, we can automatically send this email to the "New patient" list in Dock, auto-assign it to someone and even set a due date. Contact us at support@dock.health to learn more`,
  },
];

const SupportViewLink = styled.a`
  color: ${palette.cyanBlue};
`;

const SupportSearchContainer = styled.div`
  width: 14rem;
`;

const FaqQuestion = ({ content, title, searchTerm }) => (
  <>
    <Spacing vertical={5} />
    <Typography variant="body1">
      <b>
        <Highlighter
          highlightClassName="highlight"
          searchWords={(searchTerm ?? '').toLowerCase().split(/\s+/)}
          autoEscape
          textToHighlight={title}
        />
      </b>
    </Typography>
    <Spacing vertical={2} />
    <Typography variant="body1">
      <Highlighter
        highlightClassName="highlight"
        searchWords={(searchTerm ?? '').toLowerCase().split(/\s+/)}
        autoEscape
        textToHighlight={content}
      />
    </Typography>
  </>
);

const questionFilter = ({ searchTerm }) => ({ content, title }) => {
  if (!searchTerm) {
    return true;
  }

  const searchTermArray = searchTerm.toLowerCase().split(/\s+/);

  return searchTermArray.some(
    word =>
      content.toLowerCase().includes(word) ||
      title.toLowerCase().includes(word),
  );
};

const SupportSectionViewFaq = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <Grid
        container
        alignItems="center"
        justify="space-between"
        wrap="nowrap"
        item
        xs={12}
      >
        <Grid item xs={6} container alignItems="center" justify="flex-start">
          <Typography variant="h2">
            <b>FAQs</b>
          </Typography>
          <Spacing horizontal={4} />
          <SupportSearchContainer>
            <Search
              fullWidth
              onChange={event => setSearchTerm(event?.target?.value ?? '')}
              value={searchTerm}
            />
          </SupportSearchContainer>
        </Grid>
        <Grid
          item
          xs={6}
          container
          justify="flex-end"
          direction="row"
          wrap="nowrap"
        >
          <Typography variant="body1">
            <SupportViewLink href="mailto:support@dock.health?Subject=Dock%20Support">
              support@dock.health
            </SupportViewLink>
          </Typography>
          <Spacing horizontal={4} />
          <Typography variant="body1">
            <SupportViewLink href="tel:857-302-0441">
              857-302-0441
            </SupportViewLink>
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Spacing vertical={4} />
      </Grid>
      {faqArticles
        .filter(questionFilter({ searchTerm }))
        .map(({ content, title }) => (
          <FaqQuestion
            content={content}
            title={title}
            searchTerm={searchTerm}
          />
        ))}
    </>
  );
};

export default SupportSectionViewFaq;
