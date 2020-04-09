import { Layout, NullLayout, SimpleLayout, PatternLayout, XmlLayout, JsonLayout, HttpPostDataLayout } from 'log4javascript';

export interface PatternLayoutParameters {
    pattern: string;
}

export interface XmlLayoutParameters {
    combineMessages?: boolean;
}

export interface JsonLayoutParameters {
    readable?: boolean;
    combineMessages?: boolean;
}

export class LogLayoutFactory {
    static getLayout( type: string, params?: PatternLayoutParameters|XmlLayoutParameters|JsonLayoutParameters ): Layout {
        switch (type) {
            case 'NullLayout':
                return new NullLayout();
            case 'SimpleLayout':
                return new SimpleLayout();
            case 'PatternLayout':
                const patternConf: PatternLayoutParameters = params as PatternLayoutParameters;
                return new PatternLayout(patternConf.pattern);
            case 'XmlLayout':
                const xmlConf: XmlLayoutParameters = params as XmlLayoutParameters;
                if (xmlConf) {
                    return new XmlLayout(xmlConf.combineMessages);
                }
                return new XmlLayout();
            case 'JsonLayout':
                const jsonConf: JsonLayoutParameters = params as JsonLayoutParameters;
                if (jsonConf) {
                    return new JsonLayout(jsonConf.readable, jsonConf.combineMessages);
                }
                return new JsonLayout();
            case 'HttpPostDataLayout':
                return new HttpPostDataLayout();
            default:
               return new NullLayout();
        }
    }
}
