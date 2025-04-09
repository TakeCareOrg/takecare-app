import Fuse from "fuse.js";
import React, { useMemo, useState, useContext } from "react";
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
import { TextComponent } from "../../../ui/text-component";
import { useColors } from "../../../styles/Colors";
import { ResponsiveContext } from "../../../contexts/responsive-context";
import { padding } from "../../../styles/global-style";
import { GradientCheckbox } from "./utils/gradient-checkbox";
import { CrossIcon } from "../../../../assets/icons/CrossIcon";

type LetterBoxProps = {
    letter: string;
    selected: string;
    setSelected: (value: any) => void;
    main: any;
    quiz: any;
};

export type ScrollViewRef = ScrollView & {
    flashScrollIndicators: () => void;
};

const fuseOptions = {
    keys: ["name"], // specify the fields you want to search in
    threshold: 0,
};

const LetterBox = ({
    letter,
    selected,
    setSelected,
    main,
    quiz,
}: LetterBoxProps) => (
    <View
        style={[
            styles.letterBox,
            {
                backgroundColor:
                    selected === letter || (letter === "A" && !selected)
                        ? main.blueGray
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
        <TextComponent
            fontSize={12}
            color={
                selected === letter || (letter === "A" && !selected)
                    ? main.white
                    : quiz.searchHeaderText
            }
        >
            {letter}
        </TextComponent>
    </View>
);

type TreatmentEncyclopediaProps = {
    onChange: (value: any) => void;
    options: any[];
    value: any;
    loading?: boolean;
};

export const TreatmentEncyclopedia = ({
    onChange,
    options,
    loading,
}: TreatmentEncyclopediaProps) => {
    const [letterSelected, setLetterSelected] = useState<string>("");
    const [selected, setSelected] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [showOthersLetters, setShowOthersLetters] = useState<boolean>(false);

    const { main, quiz } = useColors();
    const { fontSizeBasedPixel } = useContext(ResponsiveContext);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const width = Dimensions.get("window").width;

    const letterWidth = 32;
    const visibleLettersCount = Math.floor(width / letterWidth);
    const sideLettersCount = Math.floor(visibleLettersCount / 2);

    const filteredData = useMemo(() => {
        if (!options.length) {
            return [];
        }

        const _options = options.map((option) => {
            return { name: option };
        });

        const fuse = new Fuse(_options, fuseOptions);
        if (searchValue) {
            return fuse.search(searchValue).map((result) => result.item);
        }

        return _options
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((option) => {
                if (letterSelected === "") {
                    return true;
                }

                return option.name[0].toUpperCase() === letterSelected;
            });
    }, [searchValue, options, letterSelected]);

    const handlePress = (item: any) => {
        if (selected.includes(item.name)) {
            const newSelection = selected.filter(
                (selectedItem) => selectedItem !== item.name,
            );
            setSelected(newSelection);
            onChange(newSelection);
        } else {
            const newSelection = [...selected, item.name];
            setSelected(newSelection);
            onChange(newSelection);
        }
    };

    return (
        <>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <>
                    <View
                        style={[
                            styles.container,
                            { backgroundColor: quiz.searchHeaderBackground },
                        ]}
                    >
                        {alphabet
                            .slice(0, sideLettersCount)
                            .map((letter, i) => (
                                <LetterBox
                                    key={i}
                                    letter={letter}
                                    quiz={quiz}
                                    main={main}
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
                            <TextComponent
                                fontSize={12}
                                color={quiz.searchHeaderText}
                            >
                                ...
                            </TextComponent>
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
                                        backgroundColor: main.menuBackground,
                                        borderRadius: 5,
                                        padding: 10,
                                        elevation: 5,
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
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
                                                            ? main.blueGray
                                                            : "transparent",
                                                }}
                                            >
                                                <TextComponent
                                                    fontSize={16}
                                                    textWeight="regular"
                                                    color={
                                                        letterSelected ===
                                                        letter
                                                            ? main.white
                                                            : quiz.searchHeaderText
                                                    }
                                                    style={{
                                                        textAlign: "center",
                                                        width: letterWidth - 5,
                                                        ...padding(5, 0),
                                                    }}
                                                >
                                                    {letter}
                                                </TextComponent>
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
                                    quiz={quiz}
                                    main={main}
                                    selected={letterSelected}
                                    setSelected={setLetterSelected}
                                />
                            ))}
                    </View>

                    <View
                        style={[
                            styles.searchBarContainer,
                            { backgroundColor: main.container },
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
                                    color: quiz.searchHeaderText,
                                    fontFamily: "Urbanist-Regular",
                                    letterSpacing: 0.2,
                                    fontSize: fontSizeBasedPixel(12),
                                    height:
                                        Dimensions.get("window").height / 10,
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
                                    color={quiz.searchHeaderText}
                                    width={16}
                                    height={16}
                                />
                            </View>
                        )}
                    </View>

                    <FlatList
                        data={filteredData}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            const isSelected = selected.includes(item.name);
                            return (
                                <GradientCheckbox
                                    key={index}
                                    item={item.name}
                                    isSelected={isSelected}
                                    onChange={() => handlePress(item)}
                                />
                            );
                        }}
                    />

                    <TextComponent
                        font="Urbanist"
                        textWeight="semibold"
                        fontSize={12}
                        color={
                            selected.length > 0 ? main.blueGray : "transparent"
                        }
                        style={{ marginVertical: 8, textAlign: "center" }}
                        onPress={() => {
                            setSelected([]);
                            onChange([]);
                        }}
                    >
                        Clear all
                    </TextComponent>
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
        height: 32,
        borderRadius: 50,
        marginTop: 8,
        marginBottom: 8,
        justifyContent: "space-between",
        paddingRight: 8,
    },
    searchBar: {
        flex: 1,
        borderRadius: 50,
        paddingLeft: 16,
    },
});
