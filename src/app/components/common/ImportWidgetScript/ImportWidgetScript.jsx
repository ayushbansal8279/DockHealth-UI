import { useEffect } from 'react';

const ImportWidgetScript = (resourceUrl) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = resourceUrl;
    script.async = true;
    document.body.append(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [resourceUrl]);
};
export default ImportWidgetScript;
