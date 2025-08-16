import { CHAT_PATH, SINGLE_TASK_PATH } from 'routing/helpers/paths';

// eslint-disable-next-line unicorn/prevent-abbreviations
const getInterpolatedText = (tpl, args) =>
  tpl.replace(/\${(\w+)}/g, (_, v) => args[v]);

function sendNotification(message, taskIdentifier) {
  const notification = new Notification('Dock Notification', {
    // icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
    // icon: 'https://app.dock.health/assets/img/dock-logo-mini.png',
    icon: `${window.location.origin.toString()}/assets/img/dock-logo-mini.png`,
    // body: `@${user}: ${message}`,
    body: `${message}`,
  });
  notification.onclick = function (event) {
    event.preventDefault(); // prevent the browser from focusing the Notification's tab
    window.open(
      `${window.location.origin.toString()}/#${SINGLE_TASK_PATH}/${taskIdentifier}`,
      '_blank',
    );
  };
}

function sendChatNotification(message) {
  const notification = new Notification('Dock Notification', {
    icon: `${window.location.origin.toString()}/assets/img/dock-logo-mini.png`,
    body: `${message}`,
  });
  notification.onclick = function (event) {
    event.preventDefault(); // prevent the browser from focusing the Notification's tab
    window.open(`${window.location.origin.toString()}/#${CHAT_PATH}`, '_blank');
  };
}

export function triggerDesktopNotification(message, taskIdentifier) {
  if (!('Notification' in window)) {
    alert('This browser does not support system notifications!');
  } else if (Notification.permission === 'granted') {
    sendNotification(message, taskIdentifier);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        sendNotification(message, taskIdentifier);
      }
    });
  }
}

export function triggerChatDesktopNotification(message) {
  if (!('Notification' in window)) {
    alert('This browser does not support system notifications!');
  } else if (Notification.permission === 'granted') {
    sendChatNotification(message);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        sendChatNotification(message);
      }
    });
  }
}

export function determineAlertTitle(
  alertTitle,
  listName,
  description,
  userName,
  dueTime,
) {
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const title = getInterpolatedText(alertTitle, {
    task_list_name: listName,
    task_description: description,
    comment_creator: userName,
    due_time: !dueTime || dueTime === '12:00 AM' ? '' : `at ${dueTime}`,
  });
  return title;
}

export function determineAlertSubTitle(alertSubTitle, description, comment) {
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const subtitle = getInterpolatedText(alertSubTitle, {
    task_description: description,
    comment_description: comment,
  });
  return subtitle;
}

export function triggerActivityAlertForDesktopNotification(alertDetails) {
  const {
    activityAlertTitle,
    task = {},
    taskList = {},
    targetIdentifier,
  } = alertDetails;

  const listName = taskList?.listName || task?.taskList?.listName || '';

  const alertComment =
    task?.comments?.find(
      ({ commentIdentifier }) => targetIdentifier === commentIdentifier,
    ) || {};
  const userName = alertComment?.creator?.userName || '';

  const title = determineAlertTitle(
    activityAlertTitle,
    listName,
    task?.description || '',
    userName,
    task?.dueDate,
  );
  triggerDesktopNotification(title || 'Notification', task?.identifier);
}
