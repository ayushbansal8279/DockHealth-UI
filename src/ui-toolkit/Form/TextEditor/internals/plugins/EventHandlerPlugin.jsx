import React, {useLayoutEffect, useState} from "react"
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
        editor.update(() => {
            const value = $convertToMarkdownString(TRANSFORMERS)
            onFocus(state, { value })
        })
    }

    const handleBlur = (state) => {
        editor.update(() => {
            const value = $convertToMarkdownString(TRANSFORMERS)
            onBlur(state, { value })
        })
    }

    const handleKeyDown = (event) => {
        const { key } = event
        editor.update(() => {
            const value = $convertToMarkdownString(TRANSFORMERS)
            onKeyDown(editor.getEditorState(), { key, value })
        })
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