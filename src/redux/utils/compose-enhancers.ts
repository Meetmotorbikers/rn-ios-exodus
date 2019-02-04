import { compose } from 'redux';

const composeEnhancers: typeof compose =
  (process.env.NODE_ENV === 'development' &&
    window &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export default composeEnhancers;
