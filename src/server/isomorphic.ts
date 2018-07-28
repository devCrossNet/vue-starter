import * as fs                  from 'fs';
import * as path                from 'path';
import Vue                      from 'vue';
import VueI18n                  from 'vue-i18n';
import { Store }                from 'vuex';
import { Route }                from 'vue-router';
import { Component, VueRouter } from 'vue-router/types/router';
import App                      from '../app/app/App/App.vue';
import { createApp, IApp }      from '../app/app';
import { IState }               from '../app/state';
import { IAppConfig }           from '../app/config/IAppConfig';
import { PersistCookieStorage } from '../app/shared/plugins/vuex-persist/PersistCookieStorage';

export interface IServerContext {
  url: string;
  cookies: any;
  meta?: any;
  state?: any;
  acceptLanguage: string;
  htmlLang: string;
  appConfig: IAppConfig;
  redirect: boolean;
}

export interface IPreLoad {
  store?: Store<IState> | any;
  route?: Route | any;
  router?: VueRouter;
}

const setDefaultState = (context: IServerContext, store: Store<IState>) => {
  let state: IState = store.state;
  state = PersistCookieStorage.getMergedStateFromServerContext<IState>(context, state);
  state.app.config = context.appConfig;

  if (state.app && state.app.locale) {
    context.acceptLanguage = state.app.locale;
    context.htmlLang = state.app.locale.substr(0, 2);
  } else {
    state.app.locale = context.acceptLanguage;
  }

  if (context.redirect === true) {
    state.app.redirectTo = context.url;
  }

  store.replaceState(state);
};
const setMetaInformation = (context: IServerContext, app: Vue) => {
  context.meta = app.$meta();
};
const setI18nDefaultValues = (store: Store<IState>, i18n: VueI18n) => {
  const lang: string = store.state.app.locale;
  let defaultMessages: any = {};

  try {
    defaultMessages = DEVELOPMENT
                      ? JSON.parse(fs.readFileSync(path.resolve(`./i18n/${lang}.json`)).toString())
                      : nodeRequire(`../../i18n/${lang}.json`);
  } catch (e) {
    defaultMessages = nodeRequire(`../../i18n/en.json`);
  }

  i18n.locale = lang;
  i18n.fallbackLocale = 'en';
  i18n.setLocaleMessage(lang, defaultMessages);

  store.state.app.defaultMessages = defaultMessages;
};

export default (context: IServerContext) => {
  return new Promise((resolve: any, reject: any) => {
    const { app, router, store, i18n }: IApp = createApp();

    setDefaultState(context, store);
    setMetaInformation(context, app);
    setI18nDefaultValues(store, i18n);

    router.push(context.url);

    router
    .onReady(() => {
      const matchedComponents: Component[] = [App as Component].concat(router.getMatchedComponents());

      if (matchedComponents.length === 1) {
        return reject({ code: 404 });
      }

      Promise
      .all(matchedComponents.map((component: Component) => {
        if ((component as any).prefetch) {
          return (component as any).prefetch({ store, route: router.currentRoute, router } as IPreLoad);
        }

        return Promise.resolve();
      }))
      .then(() => {
        context.state = store.state;

        // If the route from the VueRouter instance differs from request we assume a redirect was triggered in the
        // Vue application. In case only the pending route is different, `router.push` or `router.replace`
        // was called, e.g. in `prefetch`.
        const currentPath = router.currentRoute.fullPath;
        const pendingPath = router.history.pending && router.history.pending.fullPath;

        if (currentPath !== context.url || (pendingPath && pendingPath !== context.url)) {
          reject({ code: 302, path: pendingPath || currentPath });
        } else {
          resolve(app);
        }
      })
      .catch(reject);

    }, reject);
  });
};
