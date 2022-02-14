import { descend, prop, sort } from 'ramda';
import palette from 'styles/palette';

export const TrendType = {
  TASKS_CREATED: 'TASKS_CREATED',
  TASKS_COMPLETED: 'TASKS_COMPLETED',
  COMMENTS_CREATED: 'COMMENTS_CREATED',
};

export const StatisticsGroupType = {
  TASK_WORKFLOWSTATUS: 'TASK_WORKFLOWSTATUS',
  TASK_ASSIGNEDTO: 'TASK_ASSIGNEDTO',
  TASK_TASKLABEL: 'TASK_TASKLABEL',
  TASK_PATIENTLABEL: 'TASK_PATIENTLABEL',
};

export function getTopMetrics(metrics, top = 10) {
  const sortedMetrics = sort(descend(prop('metricValue')), metrics);
  return sortedMetrics.reduce((accumulator, metric, index) => {
    if (index < top) return [...accumulator, metric];

    if (index === top) {
      accumulator.push({
        ...metric,
        metricName: 'Others',
        metricColor: palette.coolGrey1,
        containedMetrics: [metric],
      });
      return accumulator;
    }

    accumulator[accumulator.length - 1].metricValue += metric.metricValue;
    accumulator[accumulator.length - 1].containedMetrics.push(metric);
    return accumulator;
  }, []);
}
