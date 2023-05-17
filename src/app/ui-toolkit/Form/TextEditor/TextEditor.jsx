import React, { useLayoutEffect, useMemo, useState } from 'react';
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
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
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
import EventHandlerPlugin from './internals/plugins/EventHandlerPlugin';
import * as S from './styled';
import MentionsPlugin from './internals/plugins/MentionsPlugin';
import { MENTION } from './internals/transformers';

export default function TextEditor(props) {
  const { value, readonly } = props;
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
        $convertFromMarkdownString(value ?? '', [
          ...TRANSFORMERS,
          MENTION(props?.mentions),
        ]);
      },
      onError(error) {
        throw error;
      },
    }),
    [readonly, value, props?.mentions],
  );

  return (
    <LexicalComposer initialConfig={initial}>
      <EditableContent {...props}>{null}</EditableContent>
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
  const [isInitialized, setInitialized] = useState(false);
  const [isActive, setActive] = useState(false);

  useLayoutEffect(() => {
    editor.setEditable(!readonly);
  }, [editor, readonly]);

  useLayoutEffect(() => {
    if (autofocus) {
      editor.focus();
      initialize();
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
      $convertFromMarkdownString(value ?? '', [
        ...TRANSFORMERS,
        MENTION(mentions),
      ]);
      if (value && value[value.length - 1] === ' ') {
        const selection = $getSelection();
        if (selection) {
          selection.insertText(' ');
        }
      }
    });
  }, [editor, mentions, value]);

  const initialize = () => {
    setInitialized(true);
  };

  const handleInputFocus = (...xs) => {
    console.log("!!: handleInputFocus")
    setActive(true);
    onFocus(...xs);
  }

  const handleInputBlur = (...xs) => {
    console.log("!!: handleInputBlur")
    setActive(false);
    onBlur(...xs);
  }

  return (
    <S.Container type={type} className={className} onClick={initialize}>
      {type === 'textarea' && enabled.toolbar && (
        <ToolbarPlugin
          open={isActive}
        />
      )}
      <S.Content>
        <RichTextPlugin
          contentEditable={<S.Input />}
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={<S.Placeholder type={type}>{placeholder}</S.Placeholder>}
        />
      </S.Content>
      {isInitialized && (
        <EventHandlerPlugin
          onChange={onChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
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

// const noop = () => undefined
//
//
// const RichTextEditor = ({
//     value,
//     readOnly
// }) => {
//     const initial = useMemo(() => ({
//         editable: !readOnly,
//         nodes: [
//             HeadingNode,
//             ListNode,
//             ListItemNode,
//             QuoteNode,
//             CodeNode,
//             CodeHighlightNode,
//             TableNode,
//             TableCellNode,
//             TableRowNode,
//             AutoLinkNode,
//             LinkNode,
//             MentionNode
//         ],
//         editorState() {
//             $convertFromMarkdownString(value ?? "", TRANSFORMERS)
//         },
//         onError(error) {
//             throw error
//         }
//     }), [ value, readOnly ])
//
//     return (
//         <LexicalComposer initialConfig={initial}>
//             <ContentEditor>
//                 <HistoryPlugin />
//                 <ListPlugin />
//                 <ListMaxIndentLevelPlugin maxDepth={7} />
//                 <LinkPlugin />
//                 <AutoLinkPlugin />
//                 <AutoFocusPlugin />
//                 <CodeHighlightPlugin />
//                 <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
//             </ContentEditor>
//         </LexicalComposer>
//     )
// }
//
//
//
// import * as S from "./styled"
//
// const ContentEditor = ({ children, placeholder, value, readOnly }) => {
//     return (
//         <S.ContentEditorWrapper>
//             <RichTextPlugin
//                 placeholder={placeholder}
//                 contentEditable={<ContentEditable className="editor-input" />}
//                 ErrorBoundary={LexicalErrorBoundary}
//             />
//             {children}
//         </S.ContentEditorWrapper>
//     )
// }
