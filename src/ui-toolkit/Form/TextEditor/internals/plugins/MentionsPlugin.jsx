import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {
    LexicalTypeaheadMenuPlugin, QueryMatch, TypeaheadOption, useBasicTypeaheadTriggerMatch
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import {TextNode} from "lexical";
import {useCallback, useEffect, useMemo, useState} from "react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {$createMentionNode} from "../nodes/MentionNode";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import debounce from "lodash.debounce";
import {getListMembersByName} from "api/task-list-api";
import {mapUsersToSuggestions, SUGGESTIONS_PLACEHOLDER} from "components/common/TextEditor/helpers";
import {currentTaskListIdentifierSelector} from "selectors/task-list-selectors";
import {useSelector} from "react-redux";
import ExternalIcon from "img/external.svg";
import {getUserAvatarThumbnailUrl, getUserAvatarUrl, isUserGroup} from "helpers/user-helper";
import {Avatar} from "../../styled";

const PUNCTUATION = "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";
const NAME = "\\b[A-Z][^\\s" + PUNCTUATION + "]";

const DocumentMentionsRegex = {
    NAME, PUNCTUATION
};

const CapitalizedNameMentionsRegex = new RegExp("(^|[^#])((?:" + DocumentMentionsRegex.NAME + "{" + 1 + ",})$)");

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ["@"].join("");

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = "[^" + TRIGGERS + PUNC + "\\s]";

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS = "(?:" + "\\.[ |$]|" + // E.g. "r. " in "Mr. Smith"
    " |" + // E.g. " " in "Josh Duck"
    "[" + PUNC + "]|" + // E.g. "-' in "Salier-Hellendag"
    ")";

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp("(^|\\s|\\()(" + "[" + TRIGGERS + "]" + "((?:" + VALID_CHARS + VALID_JOINS + "){0," + LENGTH_LIMIT + "})" + ")$");

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp("(^|\\s|\\()(" + "[" + TRIGGERS + "]" + "((?:" + VALID_CHARS + "){0," + ALIAS_LENGTH_LIMIT + "})" + ")$");

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const mentionsCache = new Map();

const dummyMentionsData = ["Aayla Secura", "Admiral Dodd Rancit", "Aurra Sing", "BB-8", "Bo-Katan Kryze", "Breha Antilles-Organa", "C-3PO", "Captain Quarsh Panaka", "Chewbacca", "Darth Tyranus", "Daultay Dofine", "Dexter Jettster", "Ebe E. Endocott", "Eli Vanto", "Ezra Bridger", "Faro Argyus", "Finis Valorum", "FN-2003", 'Garazeb "Zeb" Orrelios', "Grand Inquisitor", "Greeata Jendowanian", "Hammerhead", "Han Solo", "Hevy", "Hondo Ohnaka", "Ima-Gun Di", "Inquisitors", "Inspector Thanoth", "Jabba", "Janus Greejatus", "Jaxxon", "K-2SO", "Kanan Jarrus", "Kylo Ren", "L3-37", "Lieutenant Kaydel Ko Connix", "Luke Skywalker", "Mace Windu", "Maximilian Veers", "Mother Talzin", "Nahdar Vebb", "Nahdonnis Praji", "Nien Nunb", "Obi-Wan Kenobi", "Odd Ball", "Orrimarko", "Petty Officer Thanisson", "Pooja Naberrie", "PZ-4CO", "Quarrie", "Quiggold", "Quinlan Vos", "R2-D2", "Raymus Antilles", "Ree-Yees", "Sana Starros", "Shmi Skywalker", "Shu Mai", "Tallissan Lintra", "Tarfful", "Thane Kyrell", "U9-C4", "Unkar Plutt", "Val Beckett", "Vice Admiral Amilyn Holdo", "Vober Dand", "WAC-47", "Wedge Antilles", "Wicket W. Warrick", "Xamuel Lennox", "Yaddle", "Yarael Poof", "Yoda", "Zam Wesell", "Ziro the Hutt", "Zuckuss"];

const dummyLookupService = {
    search(string, callback) {
        setTimeout(() => {
            const results = dummyMentionsData.filter((mention) => mention.toLowerCase().includes(string.toLowerCase()));
            callback(results);
        }, 500);
    }
};

function useMentionLookupService(taskListIdentifier, mentionString) {
    const [results, setResults] = useState([]);
    const [avatars, setAvatars] = useState([]);

    // useEffect(() => {
    //     const cachedResults = mentionsCache.get(mentionString);
    //
    //     if (mentionString == null) {
    //         setResults([]);
    //         return;
    //     }
    //
    //     if (cachedResults === null) {
    //         return;
    //     } else if (cachedResults !== undefined) {
    //         setResults(cachedResults);
    //         return;
    //     }
    //
    //     mentionsCache.set(mentionString, null);
    //     dummyLookupService.search(mentionString, (newResults) => {
    //         mentionsCache.set(mentionString, newResults);
    //         setResults(newResults);
    //     });
    // }, [mentionString]);

    useEffect(() => {
        const images = {}
        getListMembersByName(taskListIdentifier, mentionString)
            .then((fetchedUsers) => {
                fetchedUsers.map(user => {
                    images[user.identifier] = getUserAvatarThumbnailUrl(user) || (isUserGroup(user)
                        ? user.initials?.[0].toUpperCase()
                        : user.initials?.toLowerCase())
                })
                setResults(fetchedUsers)
                setAvatars(images)
        });
    }, [mentionString, taskListIdentifier]);

    return { results, avatars };
}

function checkForCapitalizedNameMentions(text, minMatchLength) {
    const match = CapitalizedNameMentionsRegex.exec(text);
    if (match !== null) {
        // The strategy ignores leading whitespace but we need to know it's
        // length to add it to the leadOffset
        const maybeLeadingWhitespace = match[1];

        const matchingString = match[2];
        if (matchingString != null && matchingString.length >= minMatchLength) {
            return {
                leadOffset: match.index + maybeLeadingWhitespace.length,
                matchingString,
                replaceableString: matchingString
            };
        }
    }
    return null;
}

function checkForAtSignMentions(text, minMatchLength) {
    let match = AtSignMentionsRegex.exec(text);

    if (match === null) {
        match = AtSignMentionsRegexAliasRegex.exec(text);
    }
    if (match !== null) {
        // The strategy ignores leading whitespace but we need to know it's
        // length to add it to the leadOffset
        const maybeLeadingWhitespace = match[1];

        const matchingString = match[3];
        if (matchingString.length >= minMatchLength) {
            return {
                leadOffset: match.index + maybeLeadingWhitespace.length, matchingString, replaceableString: match[2]
            };
        }
    }
    return null;
}

function getPossibleQueryMatch(text) {
    const match = checkForAtSignMentions(text, 1);
    return match === null ? checkForCapitalizedNameMentions(text, 3) : match;
}

class MentionTypeaheadOption extends TypeaheadOption {
    id;
    name;
    picture;
    color;

    constructor(id, name, picture, color) {
        super(name);
        this.id = id;
        this.name = name;
        this.picture = picture;
        this.color = color;
    }
}

function MentionsTypeaheadMenuItem({
                                       index, isSelected, onClick, onMouseEnter, option
                                   }) {
    let className = "item";
    if (isSelected) {
        className += " selected";
    }
    return (<MenuItem
            key={option.key}
            tabIndex={-1}
            ref={option.setRefElement}
            role="option"
            aria-selected={isSelected}
            id={"typeahead-item-" + index}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
        >
            <Avatar $color={option.color}>
                {option.picture.length > 2 ? <img src={option.picture} alt="avatar" /> : option.picture}
            </Avatar>
            <span className="text">{option.name}</span>
    </MenuItem>);
}

export default function MentionsPlugin({ initialized, active, onActiveChange }) {
    const [editor] = useLexicalComposerContext();
    const taskListIdentifier = useSelector(currentTaskListIdentifierSelector)

    const [queryString, setQueryString] = useState(null);

    const {results, avatars} = useMentionLookupService(taskListIdentifier, queryString);

    const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
        minLength: 0
    });

    const options = useMemo(() => results
        // .map((result) => new MentionTypeaheadOption(result.name, <i/>))
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT), [results]);

    const onSelectOption = useCallback((selectedOption, nodeToReplace, closeMenu) => {
        const { identifier, name } = selectedOption
        editor.update(() => {
            const mentionNode = $createMentionNode({ identifier, name });
            if (nodeToReplace) {
                nodeToReplace.replace(mentionNode);
            }
            mentionNode.select();
        });
        closeMenu();
    }, [editor]);

    const checkForMentionMatch = useCallback((text) => {
        const mentionMatch = getPossibleQueryMatch(text);
        const slashMatch = checkForSlashTriggerMatch(text, editor);
        return !slashMatch && mentionMatch ? mentionMatch : null;
    }, [checkForSlashTriggerMatch, editor]);

    const [suggestions, setSuggestions] = useState([])

    // const handleQueryChange = (queryString) => {
    //     setQueryString(queryString)
    //     fetchUsersWithDebounce(queryString)
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchUsersWithDebounce =
        debounce((value) => {
            getListMembersByName(taskListIdentifier, value).then((fetchedUsers) => {
                // if (areUsersSuggestionsOpened.current) {
                //     const formattedUsers = mapUsersToSuggestions(fetchedUsers);
                //     setUsersSuggestions(
                //         formattedUsers.length > 0
                //             ? formattedUsers
                //             : [SUGGESTIONS_PLACEHOLDER],
                //     );
                // }
                // setIsFetchingUsersSuggestions(false);
            });
        }, 300);

    return (<LexicalTypeaheadMenuPlugin
            onQueryChange={setQueryString}
            onSelectOption={onSelectOption}
            triggerFn={checkForMentionMatch}
            options={options}
            menuRenderFn={(anchorElementRef, {
                selectedIndex,
                selectOptionAndCleanUp,
                setHighlightedIndex
            }) => anchorElementRef && results.length ? ReactDOM.createPortal(
                <div className="typeahead-popover mentions-menu">
                    <Paper sx={{ width: 230 }}>
                        <MenuList>
                        {options.map((option, i) => {
                            const mention = new MentionTypeaheadOption(option.identifier, option.name, avatars[option.identifier], option.bubbleColor)
                            return (
                                <MentionsTypeaheadMenuItem
                                    index={i}
                                    isSelected={selectedIndex === i}
                                    onClick={() => {
                                        setHighlightedIndex(i);
                                        selectOptionAndCleanUp(option);
                                    }}
                                    onMouseEnter={() => {
                                        setHighlightedIndex(i);
                                    }}
                                    key={mention.id}
                                    option={mention}
                                />
                            );
                        })}
                        </MenuList>
                    </Paper>
                </div>, anchorElementRef.current) : null}
        />);
}
