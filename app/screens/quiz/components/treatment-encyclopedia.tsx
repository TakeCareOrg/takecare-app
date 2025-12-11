import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { CrossIcon } from "@assets/icons/cross-icon";
import { GradientCheckbox } from "@components/ui/checkbox/gradient-checkbox";
import { Text } from "@components/ui/text";
import { InputQuizProps, QuizUserResponse } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

type LetterBoxProps = {
    letter: string;
    selected: string;
    setSelected: (value: string) => void;
};

export type ScrollViewRef = ScrollView & {
    flashScrollIndicators: () => void;
};

const fuseOptions = {
    keys: ["label"], // specify the fields you want to search in
    threshold: 0, // 0.0 = exact match, 1.0 = match anything
};

const LetterBox = ({ letter, selected, setSelected }: LetterBoxProps) => {
    const { blue, white, text } = useColorTheme();

    return (
        <View
            style={[
                styles.letterBox,
                {
                    backgroundColor:
                        selected === letter || (letter === "A" && !selected)
                            ? blue[200]
                            : "transparent",
                },
            ]}
            onTouchStart={() => {
                if (selected !== letter) {
                    setSelected(letter);
                } else {
                    setSelected("");
                }
            }}
        >
            <Text
                fontSize={12}
                color={
                    selected === letter || (letter === "A" && !selected)
                        ? white
                        : text
                }
            >
                {letter}
            </Text>
        </View>
    );
};

type TreatmentEncyclopediaProps = InputQuizProps & {
    options: { label: string; value: string }[];
    value: string[];
    loading?: boolean;
    fieldKey: keyof QuizUserResponse;
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const width = Dimensions.get("window").width;

const letterWidth = 32;
const visibleLettersCount = Math.floor(width / letterWidth);
const sideLettersCount = Math.floor(visibleLettersCount / 2);

export const TreatmentEncyclopedia = ({
    value,
    onChange,
    options,
    loading,
    fieldKey,
}: TreatmentEncyclopediaProps) => {
    const [letterSelected, setLetterSelected] = useState<string>("");
    const [selected, setSelected] = useState<string[]>(value || []);
    const [searchValue, setSearchValue] = useState<string>("");
    const [showOthersLetters, setShowOthersLetters] = useState<boolean>(false);

    const { shadow, background, text, white, blue } = useColorTheme();

    const filteredData = useMemo(() => {
        if (!options?.length) {
            return [];
        }

        const fuse = new Fuse(options, fuseOptions);
        if (searchValue) {
            return fuse.search(searchValue).map((result) => result.item);
        }

        return options
            .sort((a, b) => a.label.localeCompare(b.label))
            .filter((option) => {
                if (letterSelected === "") {
                    return true;
                }

                return option.label[0]?.toUpperCase() === letterSelected;
            });
    }, [searchValue, options, letterSelected]);

    const handlePress = (item: { label: string; value: string }) => {
        if (selected.some((selectedItem) => selectedItem === item.value)) {
            const newSelection = selected.filter(
                (selectedItem) => selectedItem !== item.value,
            );
            setSelected(newSelection);
            onChange((prev: QuizUserResponse) => ({
                ...prev,
                [fieldKey]: newSelection,
            }));
        } else {
            const newSelection = [...selected, item.value];
            setSelected(newSelection);
            onChange((prev: QuizUserResponse) => ({
                ...prev,
                [fieldKey]: newSelection,
            }));
        }
    };

    return (
        <>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <>
                    <View
                        style={[styles.container, { backgroundColor: shadow }]}
                    >
                        {alphabet
                            .slice(0, sideLettersCount)
                            .map((letter, i) => (
                                <LetterBox
                                    key={i}
                                    letter={letter}
                                    selected={letterSelected}
                                    setSelected={setLetterSelected}
                                />
                            ))}

                        <View
                            style={styles.ellipsisBox}
                            onTouchStart={() => {
                                setShowOthersLetters(!showOthersLetters);
                            }}
                        >
                            <Text fontSize={12} color={text}>
                                ...
                            </Text>
                        </View>

                        <Modal
                            transparent
                            visible={showOthersLetters}
                            animationType="fade"
                            onRequestClose={() => setShowOthersLetters(false)}
                        >
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                activeOpacity={1}
                                onPressOut={() => setShowOthersLetters(false)}
                            >
                                <View
                                    style={{
                                        position: "absolute",
                                        top:
                                            Dimensions.get("window").height /
                                            3.2,
                                        right: 15,
                                        backgroundColor: background,
                                        borderRadius: 5,
                                        padding: 10,
                                        elevation: 5,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        width: "93%",
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {alphabet
                                        .slice(
                                            sideLettersCount,
                                            -sideLettersCount + 1,
                                        )
                                        .map((letter, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => {
                                                    if (
                                                        letterSelected !==
                                                        letter
                                                    ) {
                                                        setLetterSelected(
                                                            letter,
                                                        );
                                                    } else {
                                                        setLetterSelected("");
                                                    }
                                                    setShowOthersLetters(false);
                                                }}
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderRadius: 50,
                                                    backgroundColor:
                                                        letterSelected ===
                                                        letter
                                                            ? blue[200]
                                                            : "transparent",
                                                }}
                                            >
                                                <Text
                                                    fontSize={14}
                                                    weight="600"
                                                    color={
                                                        letterSelected ===
                                                        letter
                                                            ? white
                                                            : text
                                                    }
                                                    style={{
                                                        textAlign: "center",
                                                        width: letterWidth - 5,
                                                    }}
                                                >
                                                    {letter}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            </TouchableOpacity>
                        </Modal>

                        {alphabet
                            .slice(-sideLettersCount + 1)
                            .map((letter, i) => (
                                <LetterBox
                                    key={i}
                                    letter={letter}
                                    selected={letterSelected}
                                    setSelected={setLetterSelected}
                                />
                            ))}
                    </View>

                    <View
                        style={[
                            styles.searchBarContainer,
                            { backgroundColor: background },
                        ]}
                    >
                        <TextInput
                            onChangeText={(text) => setSearchValue(text)}
                            placeholder="Search for something..."
                            value={searchValue ? searchValue : ""}
                            multiline={false}
                            numberOfLines={1}
                            scrollEnabled={false}
                            style={[
                                styles.searchBar,
                                {
                                    color: text,
                                    fontFamily: "Urbanist-Regular",
                                    letterSpacing: 0.2,
                                },
                            ]}
                        />
                        {searchValue.length > 0 && (
                            <View
                                onTouchStart={() => {
                                    setSearchValue("");
                                }}
                            >
                                <CrossIcon
                                    color={text}
                                    width={16}
                                    height={16}
                                />
                            </View>
                        )}
                    </View>

                    <FlatList
                        data={filteredData}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={{ gap: 10 }}
                        ListFooterComponent={() => (
                            <View style={{ height: 200 }} />
                        )}
                        renderItem={({ item, index }) => {
                            const isSelected = selected.some(
                                (selectedItem) => selectedItem === item.value,
                            );
                            return (
                                <GradientCheckbox
                                    key={index}
                                    item={item.label}
                                    isSelected={isSelected}
                                    onChange={() => handlePress(item)}
                                />
                            );
                        }}
                    />

                    <Text
                        weight="600"
                        fontSize={12}
                        color={selected.length > 0 ? blue[500] : "transparent"}
                        style={{ marginVertical: 8, textAlign: "center" }}
                        onPress={() => {
                            setSelected([]);
                            onChange((prev: QuizUserResponse) => ({
                                ...prev,
                                chronic_illnesses: [],
                            }));
                        }}
                    >
                        Clear all
                    </Text>
                </>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "nowrap",
        borderRadius: 50,
        overflow: "hidden",
        width: "100%",
    },
    letterBox: {
        width: (Dimensions.get("window").width - 10) / 13,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 32,
    },
    ellipsisBox: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    searchIconBox: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 38,
        borderRadius: 50,
        marginTop: 8,
        marginBottom: 8,
        justifyContent: "space-between",
        paddingRight: 8,
    },
    searchBar: {
        flex: 1,
    },
});
