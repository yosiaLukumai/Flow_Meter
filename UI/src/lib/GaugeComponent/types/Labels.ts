import { defaultMarkLabel, MarkLabel } from './Mark';
export interface Labels {
    valueLabel?: ValueLabel,
    markLabel?: MarkLabel
}

export interface ValueLabel {
    formatTextValue?: (value: any) => string;
    matchColorWithArc?: boolean;
    style?: React.CSSProperties;
    hide?: boolean;
}

export const defaultValueLabel: ValueLabel = {
    formatTextValue: undefined,
    matchColorWithArc: false,
    style: {
        fontSize: "35px",
        fill: '#fff',
        textShadow: "black 1px 1px 0px, black 0px 0px 0.5em, black 0px 0px 0.2em"
    },
    hide: false
}
export const defaultLabels: Labels = {
    valueLabel: defaultValueLabel,
    markLabel: defaultMarkLabel
}