import React, { useContext, useLayoutEffect, useState } from "react";
import debounce from "lodash.debounce"
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { noop } from 'ui-toolkit/utilities';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  BLUR_COMMAND,
  COMMAND_PRIORITY_CRITICAL
} from 'lexical';
import {
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { MENTION } from '../transformers';
import { StateContext } from "ui-toolkit/Form/TextEditor/TextEditor";
import { traverse } from "ui-toolkit/Form/TextEditor/helpers";

export default function EventHandlerPlugin({
  onChange = noop,
  onBlur = noop,
  onKeyDown = noop,
}) {
  const [editor] = useLexicalComposerContext();
  const [state] = useContext(StateContext);
  const [isDirty, setDirty] = useState(false);

  const handleBlur = debounce(() => {
    if (state.isActive) {
      console.log("#$# handleBlur", state.isActive);
      state.setActive(false);
      editor.update(() => {
        const value = $convertToMarkdownString([...TRANSFORMERS, MENTION([])]);
        const editorState = editor.getEditorState().toJSON();
        const mentions = [];
        traverse(editorState.root, (node) => {
          if (node.type === 'mention') {
            mentions.push(node.mention);
          }
        });
        onBlur(editor, { value, mentions });
        setDirty(false);
      });
    }
  });

  const handleKeyDown = debounce((event) => {
    if (state.isActive) {
      const { key, shiftKey } = event;
      editor.update(() => {
        const value = $convertToMarkdownString([...TRANSFORMERS, MENTION([])]);
        const editorState = editor.getEditorState().toJSON();
        const mentions = [];
        traverse(editorState.root, (node) => {
          if (node.type === 'mention') {
            mentions.push(node.mention);
          }
        });
        onKeyDown(editor, { key, value, mentions, shiftKey });
        setDirty(true);
      });
    }
  });

  const handleChange = debounce(() => {
    if (state.isActive && isDirty) {
      editor.update(() => {
        const value = $convertToMarkdownString([...TRANSFORMERS, MENTION([])]);
        const editorState = editor.getEditorState().toJSON();
        const mentions = [];
        traverse(editorState.root, (node) => {
          if (node.type === 'mention') {
            mentions.push(node.mention);
          }
        });
        console.log("#$# handleChange");
        onChange(editor, { value, mentions });
      });
    }
    setDirty(true);
  });

  useLayoutEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        BLUR_COMMAND,
        (_, editor) => {
          handleBlur(editor.getEditorState());
          return true;
        },
        COMMAND_PRIORITY_CRITICAL,
      )
    );
  }, [editor]);

  useLayoutEffect(() => {
    return editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement !== null) {
        prevRootElement.removeEventListener('keydown', handleKeyDown);
      }
      if (rootElement !== null) {
        rootElement.addEventListener('keydown', handleKeyDown);
      }
    });
  }, [editor]);

  return (
    <>
      <OnChangePlugin
        ignoreSelectionChange
        ignoreHistoryMergeTagChange
        onChange={handleChange}
      />
    </>
  );
}
