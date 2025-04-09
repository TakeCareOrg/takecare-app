declare module "react-native-svg-charts" {
    import { Component } from "react";
    import { ViewStyle } from "react-native";
    import { PathProps } from "react-native-svg";

    export interface LineChartProps {
        data: number[] | { value: number }[];
        style?: ViewStyle;
        svg?: Partial<PathProps>;
        contentInset?: {
            top?: number;
            left?: number;
            right?: number;
            bottom?: number;
        };
        curve?: any;
    }

    export class LineChart extends Component<LineChartProps> {}

    export class Grid extends Component {}
}
