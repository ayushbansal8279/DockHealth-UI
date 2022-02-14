import { RichUtils, Modifier, EditorState } from 'draft-js';
import { moveSelectionToEnd } from '../helpers';

export const createLinkAtSelection = (
  editorState,
  { text = '', link = '' },
) => {
  if (link === '') return editorState;
  const linkTitle = text === '' ? link : text;
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
    url: link,
  });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const selection = editorState.getSelection();
  const newContentState = Modifier.replaceText(
    contentStateWithEntity,
    selection,
    linkTitle,
    null,
    entityKey,
  );
  let nextEditorState = EditorState.set(editorState, {
    currentContent: newContentState,
  });
  nextEditorState = RichUtils.toggleLink(
    nextEditorState,
    nextEditorState.getSelection(),
    entityKey,
  );

  return moveSelectionToEnd(nextEditorState);
};

export const removeLinkAtSelection = editorState => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const startKey = selectionState.getStartKey();
  const contentBlock = contentState.getBlockForKey(startKey);
  const startOffset = selectionState.getStartOffset();
  const entity = contentBlock.getEntityAt(startOffset);

  if (!entity) {
    return editorState;
  }

  let entitySelection = null;

  contentBlock.findEntityRanges(
    character => character.getEntity() === entity,
    (start, end) => {
      entitySelection = selectionState.merge({
        anchorOffset: start,
        focusOffset: end,
      });
    },
  );

  const newContentState = Modifier.applyEntity(
    contentState,
    entitySelection,
    null,
  );

  return EditorState.push(editorState, newContentState, 'apply-entity');
  // return RichUtils.toggleLink(editorState, selection, null);
};

export const getCurrentEntityKey = editorState => {
  const selection = editorState.getSelection();
  const anchorKey = selection.getAnchorKey();
  const contentState = editorState.getCurrentContent();
  const anchorBlock = contentState.getBlockForKey(anchorKey);
  const offset = selection.getAnchorOffset();
  const index = selection.getIsBackward() ? offset - 1 : offset;
  return anchorBlock.getEntityAt(index);
};

export const getCurrentEntity = editorState => {
  const contentState = editorState.getCurrentContent();
  const entityKey = getCurrentEntityKey(editorState);
  return entityKey ? contentState.getEntity(entityKey) : null;
};

export const hasEntity = (editorState, entityType) => {
  const entity = getCurrentEntity(editorState);
  return Boolean(entity && entity.getType() === entityType);
};
