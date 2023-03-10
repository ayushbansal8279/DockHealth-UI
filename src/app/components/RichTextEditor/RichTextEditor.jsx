import React, {useState, useCallback} from "react";
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {CharacterLimitPlugin} from '@lexical/react/LexicalCharacterLimitPlugin';
import {CheckListPlugin} from '@lexical/react/LexicalCheckListPlugin';
import {ClearEditorPlugin} from '@lexical/react/LexicalClearEditorPlugin';
import {CollaborationPlugin} from '@lexical/react/LexicalCollaborationPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {HashtagPlugin} from '@lexical/react/LexicalHashtagPlugin';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {HorizontalRulePlugin} from '@lexical/react/LexicalHorizontalRulePlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {TabIndentationPlugin} from '@lexical/react/LexicalTabIndentationPlugin';
import {TablePlugin} from '@lexical/react/LexicalTablePlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {
    $getRoot,
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_CRITICAL,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND
} from 'lexical';
import {
    $getSelectionStyleValueForProperty,
    $isParentElementRTL,
    $patchStyleText,
    $selectAll,
    $setBlocksType_experimental,
} from '@lexical/selection';
import {useEffect} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { TreeView } from "@lexical/react/LexicalTreeView";

export function TreeViewPlugin() {
    const [editor] = useLexicalComposerContext();
    return (
        <TreeView
            viewClassName="tree-view-output"
            timeTravelPanelClassName="debug-timetravel-panel"
            timeTravelButtonClassName="debug-timetravel-button"
            timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
            timeTravelPanelButtonClassName="debug-timetravel-panel-button"
            editor={editor}
        />
    );
}

const initialConfig = {
    namespace: 'MyEditor'
};

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState) {
    editorState.read(() => {
        // Read the contents of the EditorState here.
        const root = $getRoot();
        const selection = $getSelection();

        console.log(root, selection);
    });
}

function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Focus the editor when the effect fires!
        editor.focus();
    }, [editor]);

    return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
    console.error(error);
}

function RichTextEditor() {


    return (
        <>
            <LexicalComposer initialConfig={initialConfig}>
                <Toolbar />
                <PlainTextPlugin
                    contentEditable={<ContentEditable />}
                    placeholder={<div>Enter some text...</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <TreeViewPlugin />
                <OnChangePlugin onChange={onChange} />
                <HistoryPlugin />
                <MyCustomAutoFocusPlugin />
            </LexicalComposer>
        </>
    );
}

const Toolbar = () => {
    const [editor] = useLexicalComposerContext();
    const [activeEditor, setActiveEditor] = useState(editor);
    const [isBold, setIsBold] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Update text format
            setIsBold(selection.hasFormat('bold'));
        }
    }, [activeEditor, setIsBold])

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            (_payload, newEditor) => {
                updateToolbar();
                setActiveEditor(newEditor);
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor, updateToolbar]);

    const applyStyleText = useCallback(
        (styles) => {
            activeEditor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $patchStyleText(selection, styles);
                }
            });
        },
        [activeEditor],
    );

    return (
        <button
            onClick={() => {
                console.log("!", isBold, activeEditor)
                applyStyleText({ color: "red" })
                return activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            type="button"
        >
            Bold: {String(isBold)}
        </button>
    )
}

export default RichTextEditor;