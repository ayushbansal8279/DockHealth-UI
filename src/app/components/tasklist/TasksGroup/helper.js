
export const getTaskCount = (metrics) => {
  if (!metrics || !Array.isArray(metrics)) {
    return 0;
  }
  
  const taskMetric = metrics.find((m) => 
    m.metricName && m.metricName.includes('TASKS')
  );
  return taskMetric ? taskMetric.metricValue : 0;
};

export const getPatientCount = (metrics) => {
  if (!metrics || !Array.isArray(metrics)) {
    return 0;
  }
  
  const patientMetric = metrics.find((m) => 
    m.metricName && m.metricName.includes('PATIENTS')
  );
  return patientMetric ? patientMetric.metricValue : 0;
};

