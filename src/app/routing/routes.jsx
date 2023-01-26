import React, { useState, useEffect, Suspense } from 'react';
import { Redirect, Switch, useHistory } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import queryString from 'query-string';
import ReactGA from 'react-ga';
import sendEvent from 'api/usage-api';
import PageLoader from 'components/navigation/PageLoader';
import {
  AUTH_ROUTES,
  ONBOARDING_ROUTES,
  TEMPLATE_CORE_SUBSCRIPTION_PLAN_ROUTES,
  SETTINGS_ROUTES,
  SIMPLE_ROUTES,
} from './config';
import TemplateAuthBase from '../views/TemplateAuthBase/TemplateAuthBase';
import TemplateCore from '../views/TemplateCore/TemplateCore';
import TemplateCoreSubscriptionPlan from '../views/TemplateCore/TemplateCoreSubscriptionPlan';
import OnboardingTemplate from '../views/onboarding/OnboardingTemplate';
import SecuredRoute from './SecuredRoute';
import EmbeddedSSO from '../views/auth/EmbeddedSso';

const transformPathname = (pathname) =>
  decodeURIComponent(pathname).replace(/^\/+/, '/');

const sendPageviewEvent = async ({ history, pathname }) => {
  const searchParameters = queryString.parse(history.location.search);

  const mappedSearchParameters = Object.entries(searchParameters).map(
    ([name, value]) => ({ name, value }),
  );

  await sendEvent({
    eventAction: pathname,
    eventCategory: 'Open View',
    usageEventType: 'PAGE_VIEW',
    metaData: mappedSearchParameters,
  });
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const Routes = () => {
  const history = useHistory();
  const [redirection, setRedirection] = useState(null);

  useEffectOnce(() => {
    const firstPathname = transformPathname(history.location?.pathname);

    ReactGA.pageview(firstPathname, ['webapp']);
    ReactGA.pageview(firstPathname, ['rollup']);

    const removeHistoryListener = history.listen((location) => {
      sendPageviewEvent({
        pathname: transformPathname(location.pathname),
        history,
      });
      ReactGA.pageview(transformPathname(location.pathname), ['webapp']);
      ReactGA.pageview(transformPathname(location.pathname), ['rollup']);
    });

    return () => {
      removeHistoryListener();
    };
  });

  useEffect(() => {
    if (redirection) {
      history.push(redirection);
      setRedirection(null);
    }
  }, [history, redirection]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {AUTH_ROUTES.map((route) => (
          <Redirect
            exact
            key={route.path}
            from={route.path}
            to={`/auth${route.path}`}
          />
        ))}
        {ONBOARDING_ROUTES.map((route) => (
          <Redirect
            exact
            key={route.path}
            from={route.path}
            to={`/onboarding${route.path}`}
          />
        ))}
        {TEMPLATE_CORE_SUBSCRIPTION_PLAN_ROUTES.map((route) => (
          <Redirect
            exact
            key={route.path}
            from={route.path}
            to={`/core${route.path}`}
          />
        ))}
        {SETTINGS_ROUTES.map((route) => (
          <Redirect
            exact
            key={route.path}
            from={route.path}
            to={`/settings${route.path}`}
          />
        ))}
        {SIMPLE_ROUTES?.map((route) => (
          <SecuredRoute
            key={route.path}
            path={route.path}
            component={route.RouteComponent}
          />
        ))}
        <SecuredRoute
          path="/auth/embedded"
          component={EmbeddedSSO}
          // render={() => <TemplateAuthBase childRoutes={AUTH_ROUTES} />}
        />
        <SecuredRoute
          path="/auth"
          render={() => <TemplateAuthBase childRoutes={AUTH_ROUTES} />}
        />
        <Redirect exact from="/core/workflows" to="/core/workflows/library" />
        <Redirect
          exact
          from="/core/patients/list"
          to="/core/patients/list/all"
        />
        <SecuredRoute
          path="/core"
          render={() => (
            <TemplateCoreSubscriptionPlan
              childRoutes={TEMPLATE_CORE_SUBSCRIPTION_PLAN_ROUTES}
              setRedirection={setRedirection}
            />
          )}
        />
        <SecuredRoute
          path="/onboarding"
          render={() => (
            <OnboardingTemplate
              childRoutes={ONBOARDING_ROUTES}
              setRedirection={setRedirection}
            />
          )}
        />
        <SecuredRoute
          path="/settings"
          render={() => (
            <TemplateCore
              childRoutes={SETTINGS_ROUTES}
              setRedirection={setRedirection}
            />
          )}
        />
        <Redirect to="/core/home/my-tasks" />
      </Switch>
    </Suspense>
  );
};

export default Routes;
