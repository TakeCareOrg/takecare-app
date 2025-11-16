export interface Setting {
    label: string;
    onPress: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "danger";
}
