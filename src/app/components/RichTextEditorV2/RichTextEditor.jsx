import ExampleTheme from "./themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import "./styles.css";

import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import MentionsPlugin from "./plugins/MentionsPlugin";
import { MentionNode } from "components/RichTextEditorV2/nodes/MentionNode";
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import debounce from "lodash.debounce";
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    TRANSFORMERS,
} from "@lexical/markdown";
import {useEffect, useMemo, useState} from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {COMMAND_PRIORITY_LOW, KEY_ENTER_COMMAND} from "lexical";

function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig = {
    // The editor theme
    theme: ExampleTheme,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    // Any custom nodes go here
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
    ]
};

const traverse = (node, callback) => {
    callback(node)
    if (node.children) {
        for (const child of node.children) {
            traverse(child, callback)
        }
    }
}

export default function Editor({ value = null, noStyle = false, readOnly = false, textArea = false,
                                   onChange = () => undefined, isToolbarActive = false, onSubmit = () => undefined,
                               onClick = () => undefined }) {
    const [initialized, setInitialized] = useState(false)

    const handleChange = debounce((state, editor) => {
        if (!initialized) {
            setInitialized(true)
            return
        }
        const json = state.toJSON();
        editor.update(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS)
            traverse(json.root, (node) => {
                if (node.type === "mention") {
                    console.log(node);
                }
            })
            onChange(markdown)
        })
    }, 1000)

    const handleSubmit = debounce((e) => {
        console.log("!");
        onSubmit(e)
    }, 250)

    return (
        <LexicalComposer initialConfig={{
            editable: !readOnly,
            editorState: () => $convertFromMarkdownString(value || "", TRANSFORMERS),
            theme: ExampleTheme,
            onError(error) {
                throw error;
            },
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
            ]
        }}>
            <div className={noStyle ? "noStyle" : ("editor-container" + (textArea ? " editor-container-textarea" : ""))}
            onClick={(e) => { e.stopPropagation() }}>
                {isToolbarActive && <ToolbarPlugin />}
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        ErrorBoundary={LexicalErrorBoundary}
                        placeholder={""}
                    />
                    {/*<MentionsPlugin taskListIdentifier={taskListIdentifier}/>*/}
                    <HistoryPlugin />
                    {/*<TreeViewPlugin />*/}
                    <AutoFocusPlugin />
                    <CodeHighlightPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <AutoLinkPlugin />
                    <ListMaxIndentLevelPlugin maxDepth={7} />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    <OnChangePlugin onChange={handleChange} ignoreHistoryMergeTagChange ignoreSelectionChange />
                    <Foobar onSubmit={handleSubmit}/>
                </div>
            </div>
        </LexicalComposer>
    );
}


const Foobar = ({ onSubmit }) => {
    const [editor] = useLexicalComposerContext();

    editor.registerCommand(
        KEY_ENTER_COMMAND,
        (payload) => {
            onSubmit(payload);
            return false
        },
        COMMAND_PRIORITY_LOW,
    );

    return (
        null
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