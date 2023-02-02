import PlaceCalledHomeImage from 'img/tour/dashboard/place-called-home.svg';
import OrganizedForYouImage from 'img/tour/dashboard/organized-for-you.svg';
import MoveThingsAroundImage from 'img/tour/dashboard/move-things-around.svg';
import OpenDrawerImage from 'img/tour/dashboard/open-drawer.svg';
import CreateANewListImage from 'img/tour/dashboard/create-a-new-list.svg';
import GettingAroundImage from 'img/tour/dashboard/getting-around.svg';
import BlueDotImage from 'img/tour/dashboard/blue-dot.svg';

export const FIRST_TOUR_STEPS = [
  {
    key: 1,
    icon: PlaceCalledHomeImage,
    title: 'A new place to call Home',
    description:
      'We’ve created a new dashboard we’re simply calling Home. Along with a new look, you’ll also find some new items on your Home dashboard, including the ability to view all of your to-dos, across all of your lists, on a single page.',
  },
  {
    key: 2,
    icon: OrganizedForYouImage,
    title: 'We’ve organized for you',
    description:
      'Your Home screen only shows the tasks assigned to you. You’ll also notice the it’s organized by due date: Today, Next 7 days and My Tasks. If there aren’t assigned due dates, your view will just show My Tasks.',
  },
  {
    key: 3,
    icon: MoveThingsAroundImage,
    title: 'You can move things around',
    description:
      'We made re-ordering your tasks easier. On the Home screen, you can move a task within a group to order them in the way that works best for you.',
  },
  {
    key: 4,
    icon: OpenDrawerImage,
    title: 'Open the drawer',
    description:
      'Simply clicking on a task on your Home screen will show you its details. The drawer will slide out from the right side of the screen to reveal all the nitty gritty. Or you can click on the list name to see all the tasks in the list.',
  },
  {
    key: 5,
    icon: CreateANewListImage,
    title: 'Create a new list',
    description:
      'Click on My Lists which will take you to the list page. Then you can create a new list.',
  },
  {
    key: 6,
    icon: GettingAroundImage,
    title: 'Getting around',
    description:
      'To access the rest of the pages that you’re used to, click the icon at the top left of the screen.',
  },
  {
    key: 7,
    icon: BlueDotImage,
    title: 'Look for the blue dot',
    description:
      'If you see a blue dot next to the number  indicating how many open tasks there are in a list, it means something new was added to that list.',
  },
];

export default FIRST_TOUR_STEPS;
