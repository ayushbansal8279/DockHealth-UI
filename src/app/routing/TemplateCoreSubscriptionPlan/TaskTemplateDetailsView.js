/* eslint-disable import/prefer-default-export */
import { hideHeader } from 'actions/template-actions';

export const onEnterTemplateDetailsView = ({ dispatch }) => {
  dispatch(hideHeader());
};
