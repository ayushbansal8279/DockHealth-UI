import { all, put, takeEvery } from 'redux-saga/effects';
import * as TemplateActions from 'actions/template-actions';

const INITIALIZE_HIDDEN_NAVBAR_TEMPLATE = 'INITIALIZE_HIDDEN_NAVBAR_TEMPLATE';
const REMOVE_HIDDEN_NAVBAR_TEMPLATE = 'REMOVE_HIDDEN_NAVBAR_TEMPLATE';

export const initializeHiddenNavbarTemplate = () => ({
  type: INITIALIZE_HIDDEN_NAVBAR_TEMPLATE,
});

export const removeHiddenNavbarTemplate = () => ({
  type: REMOVE_HIDDEN_NAVBAR_TEMPLATE,
});

function* doInitializeHiddenNavbarTemplate() {
  yield all([
    put(TemplateActions.hideHeader()),
    put(TemplateActions.hideNavbar()),
  ]);
}

function* doRemoveHiddenNavbarTemplate() {
  yield all([
    put(TemplateActions.showHeader()),
    put(TemplateActions.showNavbar()),
  ]);
}

export default function* watchTemplate() {
  yield takeEvery(
    INITIALIZE_HIDDEN_NAVBAR_TEMPLATE,
    doInitializeHiddenNavbarTemplate,
  );
  yield takeEvery(REMOVE_HIDDEN_NAVBAR_TEMPLATE, doRemoveHiddenNavbarTemplate);
}
