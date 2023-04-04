import React, {useLayoutEffect, useMemo} from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import CodeHighlightPlugin from "./internals/plugins/CodeHighlightPlugin"
import ListMaxIndentLevelPlugin from "./internals/plugins/ListMaxIndentLevelPlugin"
import AutoLinkPlugin from "./internals/plugins/AutoLinkPlugin"
import ToolbarPlugin from "./internals/plugins/ToolbarPlugin"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    TRANSFORMERS,
} from "@lexical/markdown"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { ListItemNode, ListNode } from "@lexical/list"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { MentionNode } from "components/RichTextEditorV2/nodes/MentionNode"
import { noop } from "../../utilities"
import * as S from "./styled"
import Box from "../../Primitive/Box/Box";
import EventHandlerPlugin from "./internals/plugins/EventHandlerPlugin";
import {ParagraphNode} from "lexical";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";


export default function Editor(props) {
    const { value, readOnly } = props
    const initial = useMemo(() => ({
        editable: !readOnly,
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
            MentionNode
        ],
        editorState() {
            $convertFromMarkdownString(value ?? "", TRANSFORMERS)
        },
        onError(error) {
            throw error
        }
    }), [ value, readOnly ])

    return (
        <LexicalComposer initialConfig={initial}>
            <EditableContent {...props}>
                {null}
            </EditableContent>
        </LexicalComposer>
    )
}


function EditableContent({
    children,
    value = "",
    placeholder = "test",
    type = "textarea",
    readonly = false,
    onChange = noop,
    onFocus = noop,
    onBlur = noop,
    onKeyDown = noop
}) {
    const [ editor ] = useLexicalComposerContext()

    useLayoutEffect(() => {
        editor.setEditable(!readonly)
    }, [ editor, readonly ])

    useLayoutEffect(() => {
        // Hint: I'm not using LineBreakNode here as at the time I've implemented this it was broken,
        //          so I've used ParagraphNode as a workaround.
        return editor.registerNodeTransform(ParagraphNode, (node) => {
            const isLineBreakNode = node.getTextContent() === ""
            if (type === "input" && isLineBreakNode) {
                node.remove()
            }
        });
    }, [ editor, type ])

    return (
        <S.Container type={type}>
            {type === "textarea" && <ToolbarPlugin/>}
            <S.Content>
                <RichTextPlugin
                    contentEditable={<S.Input />}
                    ErrorBoundary={LexicalErrorBoundary}
                    placeholder={<S.Placeholder type={type}>{placeholder}</S.Placeholder>}
                />
            </S.Content>
            <EventHandlerPlugin
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
            />
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
    )
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