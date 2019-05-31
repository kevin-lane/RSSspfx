import * as React from 'react';
import styles from '../RssApp.module.scss';
import { IRssAppProps } from './IRssAppProps';
import {IRssItem} from './IRssAppState'

import { PrimaryButton, BasePeopleSelectedItemsList } from 'office-ui-fabric-react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Slider } from 'office-ui-fabric-react/lib/Slider';

export default class RssApp extends React.Component<IRssAppProps, any> {
  constructor(props: IRssAppProps){
    super(props);
    this.state = {
        items: [],    
        title: '',
        description: '',
        author: '',
        showPanel: false,
        numberOfNewsItems: 20
    };
    
  }

  public showSomeXML(){

      var xhttp = new XMLHttpRequest();
      
      xhttp.onreadystatechange = () => {
        
        if(xhttp.readyState == 4 && xhttp.status == 200){
          
          let newsFeedElementsArray: IRssItem[] = []; //an array to push
          let allItems = xhttp.responseXML.getElementsByTagName('item').length;
          /**For loop iterating over items (i.e. all news article items) */
          for(let i = 0; i < allItems; i++){

             let heading = xhttp.responseXML.getElementsByTagName('item')[i].children[3].innerHTML; //title
             let intro = xhttp.responseXML.getElementsByTagName('item')[i]
                              .children[4].innerHTML
                              .replace("<![CDATA[", "")
                              .replace("]]", "").replace(/<[^>]*>/g, '');
             let author = xhttp.responseXML.getElementsByTagName('item')[i].children[2].innerHTML;
            /***Showing in the console */
             console.log("Title: " + heading);
             console.log("Description: " + xhttp.responseXML.getElementsByTagName('item')[i]
                          .children[4].innerHTML.replace("<![CDATA[", "").replace("]]", ""));
             console.log("Author: " + xhttp.responseXML.getElementsByTagName('item')[i].children[2].innerHTML);   
             
              //Push all content to array and set them to state
            newsFeedElementsArray.push({
                  title: heading,
                  description: intro,
                  author: author,
                  showPanel: false,
                  numberOfNewsItems: 3
            });
            
          }  
             /**Set State to innerHTML from the xml file */
                this.setState(
                {  
                  items: newsFeedElementsArray //Newly added
                });
                console.log("News items: " + xhttp.responseXML.getElementsByTagName('item').length);
                console.log(xhttp.responseXML.getElementsByTagName('item')[1].children);
                console.log(this.state.items);
                console.log("How many items: " + this.state.items.length);
        }

      };
      xhttp.open("GET", 'https://feeds.expressen.se/nyheter/', true);
      xhttp.send();
  }


    //**Save settings for RSS Feed */
    private _saveSettings = (value) => {
      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = () => {

      if(xhttp.readyState == 4 && xhttp.status == 200){

             
        let newsFeedElementsArray: IRssItem[] = []; //an array to push


        for(let i = 0; i < this.state.numberOfNewsItems; i++){
          let heading = xhttp.responseXML.getElementsByTagName('item')[i].children[3].innerHTML; //title
          let intro = xhttp.responseXML.getElementsByTagName('item')[i]
                              .children[4].innerHTML
                              .replace("<![CDATA[", "")
                              .replace("]]", "").replace(/<[^>]*>/g, '');
          let author = xhttp.responseXML.getElementsByTagName('item')[i].children[2].innerHTML;
        
        this.setState({
            showPanel: false,
            items: newsFeedElementsArray
        });
        
        newsFeedElementsArray.push({
                title: heading,
                description: intro,
                author: author,
                showPanel: false,
                numberOfNewsItems: value
          });
        }
        console.log("News items to display: " + this.state.numberOfNewsItems); 
        console.log("News items to display??: " + this.state.items);
        console.log("How many items after change: " + this.state.items.length);
        }
      };
        xhttp.open("GET", 'https://feeds.expressen.se/nyheter/', true);
        xhttp.send();

        
    }

  public render(): React.ReactElement<IRssAppProps> {
    let newsElement = (element: IRssItem)=> { //Newly added
        return (
              <div className={ styles.row }>
                  <div className={styles.title}>{element.title}</div>
                  <div className={ styles.description }>{element.description}</div>
                  <div>{element.author}</div>
              </div>
        );
    };//Newly added

    //**Settings side panel  */
    let settingsPanel = (
      <div>
        <Panel
          isOpen={this.state.showPanel}
          type={PanelType.smallFixedFar}
          onDismiss={this._hidePanel}
          isFooterAtBottom={true}
          headerText="RSS Feed Settings"
          closeButtonAriaLabel="Close"
          onRenderFooterContent={this._onRenderFooterContent}
        >
        {/* Slider to adjust how many news the user want to display in the feed */}
        <Slider
          label="How many news do you want to display?"
          min={1}
          max={20}
          step={1}
          value={this.state.numberOfNewsItems}
          showValue={true}
          onChange={value => { 
            this.setState({
              numberOfNewsItems: value})
           }
          }
        />
          <span>{"News items to display: " + this.state.numberOfNewsItems}</span>
        </Panel>
      </div>  
  );

    return (
      <div className = {styles.column}>
         
          <DefaultButton
            data-automation-id="test"
            text="Settings"
            onClick={this._showPanel}
          /> 
          {this.state.items.map(newsElement)}
          {settingsPanel}
      </div>
      
      
    );
  }

//**Save and Cancel buttons in the side panel */
  _onRenderFooterContent = (value) => {
    return (
      <div>
        <PrimaryButton onClick={() => this._saveSettings(value)} style={{ marginRight: '8px' }}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={this._hidePanel}>Cancel</DefaultButton>
      </div>
    );
  };

    componentDidMount(){
    {this.showSomeXML()}
  }

  private _showPanel = () => {
    this.setState({ showPanel: true });
  };

  private _hidePanel = () => {
    this.setState({ showPanel: false });
  };
}
