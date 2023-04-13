import React, {useLayoutEffect, useState} from "react"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { noop } from "../../../../utilities"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import { MENTION } from "../transformers"
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
    onActiveChange,
    onChange = noop,
    onFocus = noop,
    onBlur = noop,
    onKeyDown = noop
}) {
    const [ editor ] = useLexicalComposerContext()

    const handleFocus = (state) => {
        onActiveChange(true)
        editor.update(() => {
            const value = $convertToMarkdownString([ ...TRANSFORMERS, MENTION([]) ])
            const state = editor.getEditorState().toJSON()
            const mentions = []
            traverse(state.root, (node) => {
                if (node.type === "mention") {
                    mentions.push(node.mention)
                }
            })
            onFocus(editor, { value, mentions })
        })
    }

    const handleBlur = (state) => {
        onActiveChange(false)
        editor.update(() => {
            const value = $convertToMarkdownString([ ...TRANSFORMERS, MENTION([]) ])
            const state = editor.getEditorState().toJSON()
            const mentions = []
            traverse(state.root, (node) => {
                if (node.type === "mention") {
                    mentions.push(node.mention)
                }
            })
            onBlur(editor, { value, mentions })
        })
    }

    const handleKeyDown = (event) => {
        const { key } = event
        editor.update(() => {
            const value = $convertToMarkdownString([ ...TRANSFORMERS, MENTION([]) ])
            const state = editor.getEditorState().toJSON()
            const mentions = []
            traverse(state.root, (node) => {
                if (node.type === "mention") {
                    mentions.push(node.mention)
                }
            })
            onKeyDown(editor, { key, value, mentions })
        })
    }

    const handleChange = (state) => {
        editor.update(() => {
            const value = $convertToMarkdownString([ ...TRANSFORMERS, MENTION([]) ])
            const state = editor.getEditorState().toJSON()
            const mentions = []
            traverse(state.root, (node) => {
                if (node.type === "mention") {
                    console.log("mentions2", node);
                    mentions.push(node.mention)
                }
            })
            onChange(editor, { value, mentions })
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


const traverse = (node, callback) => {
    callback(node)
    if (node.children) {
        for (const child of node.children) {
            traverse(child, callback)
        }
    }
}

const filter = (graph, predicate) => {
    const array = []
    traverse(graph, (node) => {
        if (predicate(node)) {
            array.push(node)
        }
    })

    return array
}

const map = (graph, mapper) => {
    const array = []
    traverse(graph, (node) => {
        array.push(mapper(node))
    })

    return array
}