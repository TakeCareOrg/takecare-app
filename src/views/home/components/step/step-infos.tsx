import { ButtonGroup } from "@rneui/base";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { BarChart as BarChart2 } from "react-native-gifted-charts";
import AppleHealthKit from "react-native-health";
import { useIosHealthData } from "../../../../hooks/use-ios-health-data";
import { useColors } from "../../../../styles/Colors";
import { PageContainer } from "../../../../ui/container/page-container";
import { TextComponent } from "../../../../ui/text-component";

interface HealthInputOptions {
    startDate?: string;
    value?: string;
}

interface clickedData {
    value?: object | null | number;
    date?: string;
    label?: string;
    index?: number;
    week_Average?: string | number | undefined;
    month_Average?: string | number | undefined;
    year_Average?: string | number | undefined;
}

interface StepData {
    startDate: string; // assuming the dates are stored as strings
    value: number | string; // depending on the actual type in your data
}

interface MonthlyData {
    date: Date;
    value: number;
}

interface MonthlyAverage {
    month: string;
    average: number;
}

export const StepsInfo: React.FC = () => {
    const { hasPermissions } = useIosHealthData();
    // console.log('hasPermissions: ', hasPermissions);
    // const isDarkMode = useColorScheme() === 'dark';
    const { main } = useColors();

    const [stepCount, setStepCount] = useState(0);
    const [stepData, setStepData] = useState([] as HealthInputOptions[]);
    const [selectedTime, setSelectedTime] = useState(0);
    const [stepsLoaded, setStepsLoaded] = useState(false);
    const [clickedData, setClickedData] = useState<clickedData | null | number>(
        {} as clickedData,
    );
    const [weekAverageSteps, setWeekAverageSteps] = useState<string>("0");
    const [monthAverageSteps, setMonthAverageSteps] = useState<string>("0");
    const [yearAverageSteps, setYearAverageSteps] = useState<string>("0");
    // today at midnight
    const Today = new Date().setHours(0, 0, 0, 0);

    const getStartOfWeek = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
        const start = new Date(date.setDate(diff));
        return new Date(start.setHours(0, 0, 0, 0));
    };

    const getEndOfWeek = (date: Date) => {
        const startOfWeek = getStartOfWeek(date);
        const endOfWeek = new Date(
            startOfWeek.setDate(startOfWeek.getDate() + 6),
        );
        return new Date(endOfWeek.setHours(23, 59, 59, 999));
    };

    const getStartOfMonth = () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
    };

    const getEndOfMonth = () => {
        const now = new Date();
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
        return new Date(endDate.setHours(23, 59, 59, 999));
    };

    const getStartOfYear = () => {
        const now = new Date();
        return new Date(now.getFullYear(), 0, 1); // January 1st of the current year
    };

    const stepsOptions: HealthInputOptions = useMemo(() => {
        if (selectedTime === 0) {
            return {
                startDate: new Date(Today).toISOString(),
                endDate: new Date().toISOString(),
            };
        } else if (selectedTime === 1) {
            const startOfWeek = getStartOfWeek(new Date());
            const endOfWeek = getEndOfWeek(new Date());
            return {
                startDate: startOfWeek.toISOString(),
                endDate: endOfWeek.toISOString(),
            };
        } else if (selectedTime === 2) {
            const startOfMonth = getStartOfMonth();
            const endOfMonth = getEndOfMonth();
            return {
                startDate: startOfMonth.toISOString(),
                endDate: endOfMonth.toISOString(),
            };
        } else if (selectedTime === 3) {
            const startOfYear = getStartOfYear();
            return {
                startDate: startOfYear.toISOString(),
                endDate: new Date().toISOString(),
            };
        }
        return {
            startDate: new Date(Today).toISOString(),
            endDate: new Date().toISOString(),
        };
    }, [selectedTime]);

    const currentMonthData = useMemo(() => {
        const startOfMonth = getStartOfMonth();
        const endOfMonth = getEndOfMonth();

        // Initialiser un objet pour stocker les sommes par jour
        const dailySums: { [key: number]: number } = {}; // Ajout de la signature d'index

        // Filtrer les données pour le mois actuel
        stepData.forEach((item) => {
            if (item.startDate) {
                const date = new Date(item.startDate);
                // Vérifier si la date est dans le mois actuel
                if (date >= startOfMonth && date <= endOfMonth) {
                    const day = date.getDate();
                    // Initialiser la somme du jour s'il n'existe pas encore
                    if (!dailySums[day]) {
                        dailySums[day] = 0;
                    }
                    // Ajouter la valeur au total du jour
                    dailySums[day] += Number(item.value);
                }
            }
        });

        // Convertir les sommes par jour en un tableau d'objets
        return Object.keys(dailySums).map((day) => ({
            date: new Date(
                startOfMonth.getFullYear(),
                startOfMonth.getMonth(),
                parseInt(day, 10),
            ),
            value: dailySums[parseInt(day, 10)], // Utilisation de parseInt pour convertir la clé en nombre
        }));
    }, [stepData, hasPermissions, stepsLoaded]);

    const getStartOfMonth2 = (year: number, month: number): Date => {
        return new Date(year, month, 1); // First day of the specified month
    };

    const getEndOfMonth2 = (year: number, month: number): Date => {
        const endDate = new Date(year, month + 1, 0); // Last day of the specified month
        return new Date(endDate.setHours(23, 59, 59, 999));
    };

    const aggregateDataByMonth = (stepData: StepData[]): MonthlyData[] => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const monthlyData: MonthlyData[] = [];

        // Iterate over each month from January to the current month
        for (let month = 0; month <= currentMonth; month++) {
            const startOfMonth = getStartOfMonth2(currentYear, month);
            const endOfMonth = getEndOfMonth2(currentYear, month);

            // Initialize an object to store the sums by day for the current month
            const dailySums: { [key: number]: number } = {};

            // Filter and aggregate data for the current month
            stepData.forEach((item) => {
                if (item.startDate) {
                    const date = new Date(item.startDate);
                    if (date >= startOfMonth && date <= endOfMonth) {
                        const day = date.getDate();
                        if (!dailySums[day]) {
                            dailySums[day] = 0;
                        }
                        dailySums[day] += Number(item.value);
                    }
                }
            });

            // Convert daily sums to an array of objects for the current month
            const monthData: MonthlyData[] = Object.keys(dailySums).map(
                (day) => ({
                    date: new Date(currentYear, month, parseInt(day, 10)),
                    value: dailySums[parseInt(day, 10)],
                }),
            );

            // Add the monthly data to the overall data
            monthlyData.push(...monthData);
        }
        return monthlyData;
    };

    const calculateMonthlyAverages = (
        dailyData: MonthlyData[],
    ): MonthlyAverage[] => {
        const monthlySums: { [key: string]: { sum: number; count: number } } =
            {};

        dailyData.forEach(({ date, value }) => {
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}`;
            if (!monthlySums[monthKey]) {
                monthlySums[monthKey] = { sum: 0, count: 0 };
            }
            monthlySums[monthKey].sum += value;
            monthlySums[monthKey].count += 1;
        });

        return Object.keys(monthlySums).map((monthKey) => ({
            month: monthKey,
            average: monthlySums[monthKey].sum / monthlySums[monthKey].count,
        }));
    };

    const barChartLabels = useMemo(() => {
        if (!stepsLoaded)
            return ["January", "February", "March", "April", "May", "June"];
        if (selectedTime === 0) {
            return stepData
                ?.filter((item) => item.startDate !== undefined) // Filtrer les éléments sans startDate
                ?.sort((a, b) => {
                    const dateA = new Date(a.startDate!).getTime();
                    const dateB = new Date(b.startDate!).getTime();
                    return dateA - dateB;
                })
                ?.map((result) => {
                    if (result.startDate) {
                        // console.log('result.startDate: ', result.startDate);
                        return new Date(result.startDate)
                            .toLocaleTimeString()
                            .slice(0, 2);
                        // return result;
                    } else {
                        console.log("result.startDate is undefined");
                        return "Invalid date"; // ou toute autre valeur par défaut appropriée
                    }
                });
        }
        if (selectedTime === 1) {
            return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        }
        if (selectedTime === 2) {
            return currentMonthData.map((item) => {
                if (item.date) {
                    const date = new Date(item.date);
                    return date.toLocaleString("en-us", { day: "numeric" });
                }
                return "Invalid date";
            });
        }
        if (selectedTime === 3) {
            const month = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];
            const allMonthsData = aggregateDataByMonth(stepData);

            const monthlyAverages = calculateMonthlyAverages(allMonthsData);

            return monthlyAverages.map((item) => {
                const monthId = Number(item.month.split("-")[1]) - 1;
                return month[monthId];
            });
        }
        return [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
    }, [selectedTime, stepsLoaded]);

    const barChartData = useMemo(() => {
        // comment bellow when coding
        setStepData([]);
        if (!stepsLoaded) return [20, 45, 28, 80, 99, 43];
        if (selectedTime === 0) {
            return stepData
                ?.filter((item) => item.startDate !== undefined) // Filtrer les éléments sans startDate
                ?.sort((a, b) => {
                    const dateA = new Date(a.startDate!).getTime();
                    const dateB = new Date(b.startDate!).getTime();
                    return dateA - dateB;
                })
                ?.map((result) => {
                    if (result.value) {
                        return Number(result.value).toFixed(0);
                        // return result.value;
                    } else {
                        console.log("result.value is undefined");
                        return 0; // ou toute autre valeur par défaut appropriée
                    }
                });
        }
        if (selectedTime === 1) {
            const days = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ];

            const daysData = days.map((day) => {
                const dayData = stepData.filter((item) => {
                    if (item.startDate) {
                        const date = new Date(item.startDate);
                        return (
                            date.toLocaleString("en-us", {
                                weekday: "long",
                            }) === day
                        );
                    }
                    return false;
                });
                let numSteps: number = 0;
                dayData.forEach((item) => {
                    if (item.value) {
                        numSteps += item.value;
                    }
                });

                return Number(numSteps).toFixed(0);
            });
            let averageStepsByDayData: any[] = [];
            // do an average for the week
            daysData.forEach((item) => {
                if (Number(item) > 0) {
                    averageStepsByDayData.push(item);
                }
            });

            const weekAverage = Number(
                averageStepsByDayData
                    .map((item) => Number(item))
                    .reduce((acc, val) => acc + val, 0) /
                    averageStepsByDayData.length,
            );

            setWeekAverageSteps(weekAverage.toFixed(0));
            setClickedData({
                ...clickedData,
                week_Average: weekAverage.toFixed(0),
            });

            return daysData;
        }
        if (selectedTime === 2) {
            let averageStepsByDayData: any[] = [];
            currentMonthData.map((item) => {
                if (Number(item.value) > 0) {
                    averageStepsByDayData.push(item.value);
                }
                return item.value;
            });

            const monthAverage = Number(
                averageStepsByDayData
                    .map((item) => Number(item))
                    .reduce((acc, val) => acc + val, 0) /
                    averageStepsByDayData.length,
            );

            setMonthAverageSteps(monthAverage.toFixed(0));
            setClickedData({
                ...clickedData,
                month_Average: monthAverage.toFixed(0),
            });

            return currentMonthData.map((item) => {
                return Number(item.value).toFixed(0);
            });
        }
        if (selectedTime === 3) {
            const allMonthsData = aggregateDataByMonth(stepData);

            const monthlyAverages = calculateMonthlyAverages(allMonthsData);

            const yearAverage = Number(
                monthlyAverages
                    .map((item) => item.average)
                    .reduce((acc, val) => acc + val, 0) /
                    monthlyAverages.length,
            );

            setYearAverageSteps(yearAverage.toFixed(0));

            setClickedData({
                ...clickedData,
                year_Average: yearAverage.toFixed(0),
            });

            return monthlyAverages.map((item) => {
                return item.average.toFixed(0);
            });
        }
        return [20, 45, 28, 80, 99, 43, 78];
    }, [selectedTime, stepsLoaded]);

    const highestValue = useMemo(() => {
        const maxValue = Math.max(...barChartData.map((item) => Number(item)));
        if (maxValue >= 10000) {
            return 10000;
        }
        if (maxValue >= 5000) {
            return 5000;
        }
        if (maxValue >= 1000) {
            return 500;
        }
        return 500;
    }, [barChartData]);

    useEffect(() => {
        if (!hasPermissions) return;
        setStepsLoaded(false);
        // setStepData(0);
        AppleHealthKit.getDailyStepCountSamples(
            stepsOptions,
            (err: Object, results: Array<Object>) => {
                if (err) {
                    return;
                }
                let numSteps = 0;
                numSteps = 0;
                // @ts-ignore
                results.map((result) => (numSteps += result.value));

                setStepCount(numSteps);
                ChangeClickedData(numSteps, "today", "Total", false);
                setStepData(results);
                setStepsLoaded(true);
            },
        );
    }, [hasPermissions, selectedTime]);

    const barData = [
        { value: 250, label: "M" },
        { value: 500, label: "T", frontColor: "#177AD5" },
        { value: 745, label: "W", frontColor: "#177AD5" },
        { value: 320, label: "T", spacing: 1 },
        { value: 600, label: "F", frontColor: "#177AD5" },
        { value: 256, label: "S" },
        { value: 300, label: "S" },
        { value: 1000, label: "AA" },
    ];

    function ChangeClickedData(
        value?: number,
        date?: string,
        label?: string,
        clicked?: boolean,
        index?: number,
    ) {
        if (selectedTime === 0) {
            setClickedData({
                ...clickedData,
                value: value,
                date: clicked
                    ? `${new Date().toLocaleString("en-EN", {
                          month: "short",
                          day: "2-digit",
                      })}, ${date} - ${
                          Number(date) + 1 === 24 ? "0" : Number(date) + 1
                      } `
                    : date,
                label: clicked ? "Total" : label,
            });
        }
        if (selectedTime === 1) {
            setClickedData({
                ...clickedData,
                value: stepCount,
                week_Average: clicked ? value : weekAverageSteps,
                date: clicked
                    ? date
                    : `${getStartOfWeek(new Date()).getDate()} ${getStartOfWeek(
                          new Date(),
                      ).toLocaleString("en-EN", {
                          month: "long",
                      })} - ${getEndOfWeek(
                          new Date(),
                      ).getDate()} ${getEndOfWeek(new Date()).toLocaleString(
                          "en-EN",
                          {
                              month: "long",
                          },
                      )} ${getStartOfYear().getFullYear()}`,
                label: clicked ? "Total" : "Averaged",
            });
        }

        if (selectedTime === 2) {
            setClickedData({
                ...clickedData,
                value: value,
                month_Average: clicked ? value : monthAverageSteps,
                date: clicked
                    ? `${date} ${new Date().toLocaleString("en-EN", {
                          month: "long",
                      })} ${new Date().getFullYear()}`
                    : `${getStartOfMonth().toLocaleString("en-EN", {
                          month: "long",
                      })} ${getStartOfMonth().getFullYear()}`,
                label: clicked ? "Total" : "Averaged",
            });
        }

        if (selectedTime === 3) {
            const month = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            setClickedData({
                ...clickedData,
                value: value,
                year_Average: clicked ? value : yearAverageSteps,
                date: clicked ? month[index] : `${new Date().getFullYear()}`,
                label: "Averaged",
            });
        }
    }

    const getNextDay = (date: Date, index: number = 1) => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + index);
        return nextDay;
    };

    const dataInOneObject = useMemo(() => {
        let data = [];
        for (let i = 0; i < barChartLabels.length; i++) {
            data.push({
                value: Number(barChartData[i]),
                label:
                    selectedTime === 1 || selectedTime === 3
                        ? barChartLabels[i]
                        : Number(barChartLabels[i]),
                // date: selectedTime === 1 ? barChartData[i] : Number(barChartLabels[i]),
                date:
                    selectedTime === 1 || selectedTime === 3
                        ? getNextDay(
                              getStartOfWeek(new Date()),
                              i,
                          ).toLocaleString("en-EN", {
                              month: "long",
                              year: "numeric",
                              day: "numeric",
                          })
                        : Number(barChartLabels[i]),
            });
        }
        return data;
    }, [barChartData, barChartLabels]);

    const TextData = useMemo(() => {
        if (selectedTime === 0) {
            return Number(clickedData && clickedData.value).toFixed(0);
        }
        if (selectedTime === 1) {
            return Number(
                (clickedData && clickedData.week_Average) || clickedData.value,
            ).toFixed(0);
        }
        if (selectedTime === 2) {
            return Number(
                (clickedData && clickedData.month_Average) || clickedData.value,
            ).toFixed(0);
        }
        if (selectedTime === 3) {
            return Number(
                (clickedData && clickedData.year_Average) || clickedData.value,
            ).toFixed(0);
        }
        return "suii";
    }, [selectedTime, clickedData]);

    // console.log('dataInOneObject', dataInOneObject);
    // console.log('clickedData', clickedData);

    if (!hasPermissions) {
        return (
            <PageContainer>
                <TextComponent>Only available on iOS</TextComponent>
            </PageContainer>
        );
    }
    return (
        <PageContainer>
            <View style={{ alignItems: "baseline" }}>
                {/*<CustomButtonGroup*/}
                <ButtonGroup
                    buttonStyle={{
                        padding: 0,
                        // borderColor: 'red',
                        borderStyle: "solid",
                        // borderWidth: 1,
                    }}
                    selectedButtonStyle={{
                        backgroundColor: color.isDarkMode
                            ? color.main.white
                            : color.main.black,
                        borderRadius: 16,
                    }}
                    textStyle={{
                        color: color.isDarkMode
                            ? color.main.white
                            : color.main.black,
                    }}
                    selectedTextStyle={{
                        color: color.isDarkMode
                            ? color.main.black
                            : color.main.white,
                    }}
                    buttons={["D", "W", "M", "Y"]}
                    selectedIndex={selectedTime}
                    onPress={setSelectedTime}
                    containerStyle={{
                        borderRadius: 16,
                        padding: 0,
                        marginHorizontal: 0,
                        marginVertical: 0,
                        backgroundColor: color.isDarkMode
                            ? "#1a1a1a"
                            : color.main.white,
                        borderWidth: 0,
                    }}
                    buttonContainerStyle={{
                        borderStyle: "solid",
                        borderColor: "red",
                    }}
                    innerBorderStyle={{
                        color: color.isDarkMode
                            ? color.main.black
                            : color.main.reverse,
                        width: 1,
                    }}
                />

                {stepsLoaded && (
                    <View
                        style={{
                            backgroundColor: color.main.container,
                            height: 100,
                            // width: 180,
                            width: "auto",
                            // marginLeft: 10,
                            borderRadius: 16,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            marginVertical: 10,
                        }}
                    >
                        <TextComponent>
                            {clickedData && clickedData.label}
                        </TextComponent>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "baseline",
                                // justifyContent: 'space-between',
                            }}
                        >
                            <TextComponent
                                fontSize={40}
                                style={{ marginRight: 5 }}
                            >
                                {TextData}
                            </TextComponent>
                            <TextComponent>steps</TextComponent>
                        </View>
                        <TextComponent>
                            {clickedData && clickedData.date}
                        </TextComponent>
                    </View>
                )}
            </View>
            <View>
                {stepsLoaded && (
                    <BarChart2
                        barWidth={
                            selectedTime === 1 || selectedTime === 3 ? 30 : 10
                        }
                        noOfSections={2}
                        stepValue={highestValue}
                        frontColor="lightgray"
                        data={dataInOneObject}
                        spacing={10}
                        // width={Dimensions.get('window').width - 30}
                        width={Dimensions.get("window").width - 66}
                        height={200}
                        scrollToEnd
                        yAxisThickness={1}
                        xAxisThickness={1}
                        sideColor={"blue"}
                        rulesColor={color.main.primary}
                        onScroll={() =>
                            ChangeClickedData(
                                stepCount,
                                "today",
                                "Total",
                                false,
                            )
                        }
                        xAxisLabelTextStyle={{ color: color.main.primary }}
                        xAxisColor={color.main.primary}
                        yAxisColor={color.main.primary}
                        yAxisTextStyle={{ color: color.main.primary }}
                        yAxisLabelWidth={30}
                        scrollAnimation={false}
                        onPress={(value: clickedData, index: number) =>
                            ChangeClickedData(
                                value.value,
                                value.date,
                                value.label,
                                true,
                                index,
                            )
                        }
                    />
                )}
            </View>
        </PageContainer>
    );
};
