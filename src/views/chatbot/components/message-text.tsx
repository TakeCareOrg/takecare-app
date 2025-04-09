import React from "react";
import { useColors } from "../../../styles/Colors";
import { TextComponent } from "../../../ui/text-component";
import { parseMarkdown } from "../../../utils/parse-markedown";

interface MessageTextProps {
    isSendByUser: boolean;
    messageText: string;
}

// MessageText Component
export const MessageText: React.FC<MessageTextProps> = ({
    isSendByUser,
    messageText,
}) => {
    const { main, chat } = useColors();
    if (isSendByUser) {
        return (
            <TextComponent color={main.white} fontSize={14} textWeight="medium">
                {messageText ?? ""}
            </TextComponent>
        );
    }

    return (
        <>
            {parseMarkdown(messageText || "").map(
                (element: any, index: any): React.ReactNode => {
                    switch (element.type) {
                        case "bold":
                            return (
                                <TextComponent
                                    key={index}
                                    fontSize={14}
                                    textWeight="bold"
                                    color={chat.message}
                                >
                                    {element.content}
                                </TextComponent>
                            );
                        case "italic":
                            return (
                                <TextComponent
                                    key={index}
                                    fontSize={14}
                                    textStyle="italic"
                                    color={chat.message}
                                >
                                    {element.content}
                                </TextComponent>
                            );
                        case "link":
                            return (
                                <TextComponent
                                    key={index}
                                    fontSize={14}
                                    color={chat.message}
                                >
                                    {element.content}
                                </TextComponent>
                            );
                        default:
                            return (
                                <TextComponent
                                    key={index}
                                    fontSize={14}
                                    textWeight="medium"
                                    color={chat.message}
                                >
                                    {element.content}
                                </TextComponent>
                            );
                    }
                },
            )}
        </>
    );
};
