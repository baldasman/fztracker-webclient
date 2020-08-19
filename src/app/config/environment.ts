class EnvironmentModel {
  apiUrl: string;
  cnApiUrl: string;
}

if (!window['__env']) {
  window['__env'] = {};
}

export const environment: EnvironmentModel = {
  apiUrl: window['__env'].apiUrl,
  cnApiUrl: window['__env'].cnApiUrl
};
