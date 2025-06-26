import React from "react";

import { Text } from "@components/ui/text";

import { parseMarkdown } from "@utils/chatbot/parse-markdown";

import {
    MarkdownElement,
    MarkdownElementType,
    MessageTextProps,
} from "../../../types/chatbot/chatbot.types";

export const MessageText: React.FC<MessageTextProps> = ({
    isSendByUser,
    messageText,
}) => {
    if (isSendByUser) {
        return (
            <Text color={"#FFFFFF"} fontSize={14}>
                {messageText || ""}
            </Text>
        );
    }

    const elementStyles: Record<
        MarkdownElementType,
        {
            textWeight?: "bold" | "medium";
            textStyle?: "italic";
        }
    > = {
        bold: { textWeight: "bold" },
        italic: { textStyle: "italic" },
        link: {},
        text: { textWeight: "medium" },
    };

    return (
        <>
            {parseMarkdown(messageText || "").map(
                (element: MarkdownElement, index: number) => (
                    <Text
                        key={index}
                        fontSize={14}
                        color={"#454545"}
                        {...elementStyles[element.type]}
                    >
                        {element.content}
                    </Text>
                ),
            )}
        </>
    );
};
