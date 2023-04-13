import {$createMentionNode, MentionNode} from "./nodes/MentionNode"


export const MENTION = (mentions = []) => ({
    dependencies: [ MentionNode ],
    export: (node, exportChildren, exportFormat) => {
        if (node.__type === "mention") {
            console.log("transformer:export", node, exportChildren, exportFormat);
            return `@{${node.__mention.identifier}}`
        }
    },
    importRegExp: /@{(.*)}/,
    regExp: /@{(.*)}/,
    replace: (node, match) => {
        const [ , identifier ] = match
        const mention = $createMentionNode({
            identifier,
            name: mentions
                .find(mention =>
                    mention.identifier === identifier)
                ?.name ?? identifier
        })
        console.log("transformer:replace", node, match, mention, identifier);
        node.replace(mention)
        mention.select()
        return mention
    },
    trigger: '}',
    type: 'text-match',
})