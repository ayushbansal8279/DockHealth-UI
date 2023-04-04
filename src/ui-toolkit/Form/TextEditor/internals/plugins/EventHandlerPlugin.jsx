import React, {useLayoutEffect} from "react"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { noop } from "../../../../utilities"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import {
    FOCUS_COMMAND,
    BLUR_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    LineBreakNode,
    TextNode,
    ParagraphNode,
    ElementNode
} from "lexical"
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    TRANSFORMERS,
} from "@lexical/markdown"


export default function EventHandlerPlugin({
    onChange = noop,
    onFocus = noop,
    onBlur = noop,
    onKeyDown = noop
}) {
    const [ editor ] = useLexicalComposerContext()

    const handleFocus = (state) => {
        onFocus(state, {})
    }

    const handleBlur = (state) => {
        onBlur(state, {})
    }

    const handleKeyDown = (event) => {
        const { key } = event
        onKeyDown(editor.getEditorState(), { key })
    }

    const handleChange = (state) => {
        editor.update(() => {
            const value = $convertToMarkdownString(TRANSFORMERS)
            onChange(state, { value })
        })
    }

    useLayoutEffect(() => {
        return mergeRegister(
            editor.registerCommand(FOCUS_COMMAND, (_, editor) => {
                handleFocus(editor.getEditorState())
            }, COMMAND_PRIORITY_CRITICAL),
            editor.registerCommand(BLUR_COMMAND, (_, editor) => {
                handleBlur(editor.getEditorState())
            }, COMMAND_PRIORITY_CRITICAL),
        );
    }, [ editor ])

    useLayoutEffect(() => {
        return editor.registerRootListener((rootElement, prevRootElement) => {
            if (prevRootElement !== null) {
                prevRootElement.removeEventListener('keydown', handleKeyDown)
            }
            if (rootElement !== null) {
                rootElement.addEventListener('keydown', handleKeyDown)
            }
        })
    }, [ editor ])

    return (
        <>
            <OnChangePlugin
                ignoreSelectionChange
                ignoreHistoryMergeTagChange
                onChange={handleChange}
            />
        </>
    )
}