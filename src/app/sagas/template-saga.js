import { all, put, takeEvery } from 'redux-saga/effects';
import * as TemplateActions from 'actions/template-actions';
import { log } from 'helpers/log';

const INITIALIZE_HIDDEN_NAVBAR_TEMPLATE = 'INITIALIZE_HIDDEN_NAVBAR_TEMPLATE';
const REMOVE_HIDDEN_NAVBAR_TEMPLATE = 'REMOVE_HIDDEN_NAVBAR_TEMPLATE';

export const initializeHiddenNavbarTemplate = () => ({
  type: INITIALIZE_HIDDEN_NAVBAR_TEMPLATE,
});

export const removeHiddenNavbarTemplate = () => ({
  type: REMOVE_HIDDEN_NAVBAR_TEMPLATE,
});

function* doInitializeHiddenNavbarTemplate() {
  try {
    yield all([put(TemplateActions.hideNavbar())]);
  } catch (error) {
    log(error);
  }
}

function* doRemoveHiddenNavbarTemplate() {
  try {
    yield all([put(TemplateActions.showNavbar())]);
  } catch (error) {
    log(error);
  }
}

export default function* watchTemplate() {
  yield takeEvery(
    INITIALIZE_HIDDEN_NAVBAR_TEMPLATE,
    doInitializeHiddenNavbarTemplate,
  );
  yield takeEvery(REMOVE_HIDDEN_NAVBAR_TEMPLATE, doRemoveHiddenNavbarTemplate);
}
