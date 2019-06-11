/// <reference types="react" />
import * as React from 'react';
import { IRssAppProps } from './IRssAppProps';
export default class RssApp extends React.Component<IRssAppProps, any> {
    constructor(props: IRssAppProps);
    showSomeXML(): void;
    private _saveSettings;
    render(): React.ReactElement<IRssAppProps>;
    _onRenderFooterContent: (value: any) => JSX.Element;
    componentDidMount(): void;
    private _showPanel;
    private _hidePanel;
}
