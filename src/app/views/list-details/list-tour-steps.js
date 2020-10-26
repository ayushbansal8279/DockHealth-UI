import Step1Icon from 'img/tour/list-details/step1.svg';
import Step2Icon from 'img/tour/list-details/step2.svg';
import Step3Icon from 'img/tour/list-details/step3.svg';
import Step4Icon from 'img/tour/list-details/step4.svg';
import Step5Icon from 'img/tour/list-details/step5.svg';
import Step6Icon from 'img/tour/list-details/step6.svg';

export const LIST_TOUR_STEPS = [
  {
    key: 1,
    icon: Step1Icon,
    title: 'Groups',
    description:
      "We've added another way to organize a list – using Groups. Add as many groups as you’d like and feel free to move them to any location on the page.",
  },
  {
    key: 2,
    icon: Step2Icon,
    title: 'Drag & drop',
    description:
      'We made ordering tasks easier. Now you can simply drag and drop them where you want.',
  },
  {
    key: 3,
    icon: Step3Icon,
    title: 'Quickly add a new task',
    description: `Adding a new task is now a snap. Simply type in your task in the new box with “+Add Task,” hit the enter key and the new task is saved to your list.`,
  },
  {
    key: 4,
    icon: Step4Icon,
    title: 'Expanded filtering',
    description:
      "We've added more robust filtering that allows you to use multiple criteria, so you can quickly find exactly what you're looking",
  },
  {
    key: 5,
    icon: Step5Icon,
    title: 'Minimum & Maximum views',
    description:
      'Minumum view displays the list of tasks within a Group, while Maximum view shows all the comments made on each task.',
  },
  {
    key: 6,
    icon: Step6Icon,
    title: 'A red dot = new',
    description:
      'If you see a red dot next to comments, due date, label or attachment, then something new was added since the last time you logged in.',
  },
];

export default LIST_TOUR_STEPS;
