import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ParagraphNode, $getSelection } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import ToolbarPlugin from './internals/plugins/ToolbarPlugin';
import ListMaxIndentLevelPlugin from './internals/plugins/ListMaxIndentLevelPlugin';
import AutoLinkPlugin from './internals/plugins/AutoLinkPlugin';
import CodeHighlightPlugin from './internals/plugins/CodeHighlightPlugin';
import { MentionNode } from './internals/nodes/MentionNode';
import { noop } from '../../utilities';
import EventHandlerPlugin from "./internals/plugins/EventHandlerPlugin";
import * as S from './styled';
import MentionsPlugin from './internals/plugins/MentionsPlugin';
import { MENTION } from './internals/transformers';
import { traverse } from "ui-toolkit/Form/TextEditor/helpers";

export const StateContext = createContext([{
  isInitialized: false,
  setInitialized: noop,
  isActive: false,
  setActive: noop,
  previousValue: '',
  setPreviousValue: noop
}]);

export default function TextEditor(props) {
  const { value, initialValue, readonly, mentions } = props;
  const initial = useMemo(
    () => ({
      editable: !readonly,
      nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
        MentionNode,
      ],
      editorState() {
       $convertFromMarkdownString(value || initialValue || '', [
          ...TRANSFORMERS,
          MENTION(mentions),
        ]);
      },
      onError(error) {
        throw error;
      },
    }),
    [value, initialValue, readonly, mentions],
  );

  const [isInitialized, setInitialized] = useState(false);
  const [isActive, setActive] = useState(false);
  const [previousValue, setPreviousValue] = useState(value || initialValue);

  const state = {
    isInitialized,
    setInitialized,
    isActive,
    setActive,
    previousValue,
    setPreviousValue
  }

  return (
    <LexicalComposer initialConfig={initial}>
      <StateContext.Provider value={[state]}>
        <EditableContent {...props} value={value || initialValue} />
      </StateContext.Provider>
    </LexicalComposer>
  );
}

function EditableContent({
  children,
  className,
  value = '',
  placeholder = '',
  type = 'textarea',
  readonly = false,
  autofocus = false,
  onChange = noop,
  onFocus = noop,
  onBlur = noop,
  onKeyDown = noop,
  mentions = [],
  enabled = {},
}) {
  // eslint-disable-next-line no-param-reassign
  enabled = {
    toolbar: true,
    mentions: false,
    ...enabled,
  };

  const [editor] = useLexicalComposerContext();
  const [state] = useContext(StateContext);
  const [doForceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    setForceUpdate(true);
  }, [state.isActive]);

  useEffect(() => {
    if (doForceUpdate) {
      setForceUpdate(false);
    }
  }, [doForceUpdate]);

  useLayoutEffect(() => {
    editor.setEditable(!readonly);
  }, [editor, readonly]);

  useLayoutEffect(() => {
    if (autofocus) {
      editor.focus();
      state.setInitialized(true);
    }
  }, [editor, autofocus]);

  useLayoutEffect(() => {
    // Hint: I'm not using LineBreakNode here as at the time I've implemented this it was broken,
    //          so I've used ParagraphNode as a workaround.
    return editor.registerNodeTransform(ParagraphNode, (node) => {
      const isLineBreakNode = node.getTextContent() === '';
      if (type === 'input' && isLineBreakNode) {
        node.remove();
      }
    });
  }, [editor, type]);

  useLayoutEffect(() => {
    editor.update(() => {
      if (value && value[value.length - 1] === ' ') {
        const selection = $getSelection();
        if (selection) {
          selection.insertText(' ');
        }
      }
    });
  }, [editor, value, mentions]);

  const handleFocus = () => {
    if (!state.isInitialized) {
      state.setInitialized(true);
    }
    if (!state.isActive) {
      console.log("#$# handleFocus", state.isActive);
      state.setActive(true);
      editor.update(() => {
        const value = $convertToMarkdownString([...TRANSFORMERS, MENTION([])]);
        const editorState = editor.getEditorState().toJSON();
        const mentions = [];
        traverse(editorState.root, (node) => {
          if (node.type === 'mention') {
            mentions.push(node.mention);
          }
        });
        editor.focus();
        onFocus(editor, { value, mentions });
      });
    }
  };

  return (
    <S.Container
      $type={type}
      className={className}
      onClick={handleFocus}
    >
      {type === 'textarea' && enabled.toolbar && (
        <ToolbarPlugin
          open={true /* state.isActive 8 */}
        />
      )}
      <S.Content>
        <RichTextPlugin
          contentEditable={<S.Input />}
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={<S.Placeholder type={type}>{placeholder}</S.Placeholder>}
        />
      </S.Content>
      {!doForceUpdate && state.isInitialized && (
        <EventHandlerPlugin
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      )}
      {enabled.mentions && <MentionsPlugin />}
      <HistoryPlugin />
      <ListPlugin />
      <ListMaxIndentLevelPlugin maxDepth={7} />
      <LinkPlugin />
      <AutoLinkPlugin />
      <AutoFocusPlugin />
      <CodeHighlightPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      {children}
    </S.Container>
  );
}
