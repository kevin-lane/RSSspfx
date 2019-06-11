var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import styles from '../RssApp.module.scss';
import { PrimaryButton } from 'office-ui-fabric-react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
var RssApp = (function (_super) {
    __extends(RssApp, _super);
    function RssApp(props) {
        var _this = _super.call(this, props) || this;
        //**Save settings for RSS Feed */
        _this._saveSettings = function (value) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    var newsFeedElementsArray = []; //an array to push
                    for (var i = 0; i < _this.state.numberOfNewsItems; i++) {
                        var heading = xhttp.responseXML.getElementsByTagName('item')[i].children[3].innerHTML; //title
                        var intro = xhttp.responseXML.getElementsByTagName('item')[i]
                            .children[4].innerHTML
                            .replace("<![CDATA[", "").replace(/<[^>]*>/g, '').replace("&nbsp;", "")
                            .replace("]]", "").replace(">", "").substr(0, 100);
                        var author = xhttp.responseXML.getElementsByTagName('item')[i].children[2].innerHTML;
                        var link = xhttp.responseXML.getElementsByTagName('item')[i].children[1].innerHTML;
                        _this.setState({
                            showPanel: false,
                            items: newsFeedElementsArray
                        });
                        newsFeedElementsArray.push({
                            title: heading,
                            description: intro,
                            author: author,
                            showPanel: false,
                            url: link,
                            numberOfNewsItems: value
                        });
                        if (intro.length > 20) {
                            var ending = '...';
                            intro.slice(0, intro.length - 10);
                        }
                    }
                    console.log("News items to display: " + _this.state.numberOfNewsItems);
                    console.log("News items to display??: " + _this.state.items);
                    console.log("How many items after change: " + _this.state.items.length);
                    console.log(_this.state.description);
                }
            };
            xhttp.open("GET", 'https://feeds.expressen.se/nyheter/', true);
            xhttp.send();
        };
        //**Save and Cancel buttons in the side panel */
        _this._onRenderFooterContent = function (value) {
            return (React.createElement("div", null,
                React.createElement(PrimaryButton, { onClick: function () { return _this._saveSettings(value); }, style: { marginRight: '8px' } }, "Save"),
                React.createElement(DefaultButton, { onClick: _this._hidePanel }, "Cancel")));
        };
        _this._showPanel = function () {
            _this.setState({ showPanel: true });
        };
        _this._hidePanel = function () {
            _this.setState({ showPanel: false });
        };
        _this.state = {
            items: [],
            title: '',
            description: '',
            author: '',
            showPanel: false,
            url: '',
            numberOfNewsItems: 7
        };
        return _this;
    }
    RssApp.prototype.showSomeXML = function () {
        var _this = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var newsFeedElementsArray = []; //an array to push
                var allItems = xhttp.responseXML.getElementsByTagName('item').length;
                /**For loop iterating over items (i.e. all news article items) */
                for (var i = 0; i < _this.state.numberOfNewsItems; i++) {
                    var heading = xhttp.responseXML.getElementsByTagName('item')[i].children[3].innerHTML; //title
                    var intro = xhttp.responseXML.getElementsByTagName('item')[i]
                        .children[4].innerHTML
                        .replace("<![CDATA[", "").replace(/<[^>]*>/g, '').replace("&nbsp;", "")
                        .replace("]]", "").replace(">", "").substr(0, 100);
                    //
                    var author = xhttp.responseXML.getElementsByTagName('item')[i].children[2].innerHTML;
                    var link = xhttp.responseXML.getElementsByTagName('item')[i].children[1].innerHTML;
                    /***Showing in the console */
                    console.log("Title: " + heading);
                    console.log("Description: " + xhttp.responseXML.getElementsByTagName('item')[i]
                        .children[4].innerHTML.replace("<![CDATA[", "").replace("&nbsp;", "").replace("]]", ""));
                    console.log("Author: " + xhttp.responseXML.getElementsByTagName('item')[i].children[2].innerHTML);
                    console.log("URL: " + link);
                    console.log("Desc length: " + intro.length);
                    //Push all content to array and set them to state
                    newsFeedElementsArray.push({
                        title: heading,
                        description: intro,
                        author: author,
                        showPanel: false,
                        url: link,
                        numberOfNewsItems: null
                    });
                }
                /**Set State to innerHTML from the xml file */
                _this.setState({
                    items: newsFeedElementsArray //Newly added
                });
                console.log("News items: " + xhttp.responseXML.getElementsByTagName('item').length);
                console.log(xhttp.responseXML.getElementsByTagName('item')[1].childNodes);
                console.log(_this.state.items);
                console.log("How many items: " + _this.state.items.length);
                console.log(xhttp.responseXML.getElementsByTagName('item'));
            }
        };
        xhttp.open("GET", 'https://feeds.expressen.se/nyheter/', true);
        xhttp.send();
    };
    RssApp.prototype.render = function () {
        var _this = this;
        //**Styling variables */
        var rssStyle = {
            backgroundColor: '#b5fffc',
            padding: '25px'
        };
        var columnStyle = {
            backgroundColor: '#46b0fc',
            padding: '10px',
            borderRadius: '30px'
        };
        var titleStyle = {
            //{fontSize: '30px', color:'white'}
            fontSize: '20px',
            color: 'black',
            textDecoration: 'none'
        };
        var descriptionStyle = {
            color: 'black',
            textOverflow: 'ellipsis'
        };
        var newsElement = function (element) {
            return (React.createElement("div", { style: rssStyle },
                React.createElement("div", { style: columnStyle },
                    React.createElement("a", { href: element.url, className: styles.myTitle, style: titleStyle, target: '_blank' }, element.title),
                    React.createElement("div", { className: styles.description, style: descriptionStyle }, element.description),
                    React.createElement("div", null, element.author))));
        };
        //**Settings side panel  */
        var settingsPanel = (React.createElement("div", null,
            React.createElement(Panel, { isOpen: this.state.showPanel, type: PanelType.smallFixedFar, onDismiss: this._hidePanel, isFooterAtBottom: true, headerText: "RSS Feed Settings", closeButtonAriaLabel: "Close", onRenderFooterContent: this._onRenderFooterContent },
                React.createElement(Slider, { label: "How many news do you want to display?", min: 1, max: 10, step: 1, value: this.state.numberOfNewsItems, showValue: true, onChange: function (value) {
                        _this.setState({
                            numberOfNewsItems: value
                        });
                    } }),
                React.createElement("span", null, "News items to display: " + this.state.numberOfNewsItems))));
        return (React.createElement("div", { className: styles.rssApp },
            React.createElement("div", { className: styles.column },
                React.createElement(DefaultButton, { "data-automation-id": "test", text: "Settings", onClick: this._showPanel }),
                this.state.items.map(newsElement),
                settingsPanel)));
    };
    RssApp.prototype.componentDidMount = function () {
        {
            this.showSomeXML();
        }
    };
    return RssApp;
}(React.Component));
export default RssApp;
//# sourceMappingURL=RssApp.js.map