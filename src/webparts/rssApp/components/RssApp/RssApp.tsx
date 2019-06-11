import * as React from 'react';
import styles from '../RssApp.module.scss';
import { IRssAppProps } from './IRssAppProps';
import {IRssItem} from './IRssAppState'


import { PrimaryButton, ColorPicker } from 'office-ui-fabric-react';
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
        url: '',
        numberOfNewsItems: 7
    };
  }

  public showSomeXML(){

      var xhttp = new XMLHttpRequest();
      
      xhttp.onreadystatechange = () => {
        
        if(xhttp.readyState == 4 && xhttp.status == 200){
          
          let newsFeedElementsArray: IRssItem[] = []; //an array to push
          let allItems = xhttp.responseXML.getElementsByTagName('item').length;
          /**For loop iterating over items (i.e. all news article items) */
          for(let i = 0; i < this.state.numberOfNewsItems; i++){

             let heading = xhttp.responseXML.getElementsByTagName('item')[i].children[3].innerHTML; //title
             let intro = xhttp.responseXML.getElementsByTagName('item')[i]
                              .children[4].innerHTML
                              .replace("<![CDATA[", "").replace(/<[^>]*>/g, '').replace("&nbsp;", "")
                              .replace("]]", "").replace(">", "").substr(0, 100);
                               //
             let author = xhttp.responseXML.getElementsByTagName('item')[i].children[2].innerHTML;
             let link = xhttp.responseXML.getElementsByTagName('item')[i].children[1].innerHTML;
           
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
                this.setState(
                {  
                  items: newsFeedElementsArray //Newly added
                });
                console.log("News items: " + xhttp.responseXML.getElementsByTagName('item').length);
                console.log(xhttp.responseXML.getElementsByTagName('item')[1].childNodes);
                console.log(this.state.items);
                console.log("How many items: " + this.state.items.length);
                console.log(xhttp.responseXML.getElementsByTagName('item'));
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
          .replace("<![CDATA[", "").replace(/<[^>]*>/g, '').replace("&nbsp;", "")
          .replace("]]", "").replace(">", "").substr(0, 100);
                             
          let author = xhttp.responseXML.getElementsByTagName('item')[i].children[2].innerHTML;
          let link = xhttp.responseXML.getElementsByTagName('item')[i].children[1].innerHTML;
        
        this.setState({
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

          if(intro.length > 20){
            let ending = '...';
            intro.slice(0, intro.length - 10);
          }
        }
        console.log("News items to display: " + this.state.numberOfNewsItems); 
        console.log("News items to display??: " + this.state.items);
        console.log("How many items after change: " + this.state.items.length);
        console.log(this.state.description);
        }
      };
        xhttp.open("GET", 'https://feeds.expressen.se/nyheter/', true);
        xhttp.send();
    }

  public render(): React.ReactElement<IRssAppProps> {

    //**Styling variables */
    const rssStyle = {
      backgroundColor: '#b5fffc', 
      padding: '25px'
    }
    const columnStyle = {
      backgroundColor: '#46b0fc',
      padding: '10px',
      borderRadius: '30px' 
    }
    const titleStyle = {
      //{fontSize: '30px', color:'white'}
      fontSize: '20px',
      color: 'black',
      textDecoration: 'none'
    };
    const descriptionStyle = {
      color: 'black',
      
      textOverflow: 'ellipsis'
    }
    let newsElement = (element: IRssItem)=> { //Newly added
        return (
              <div style={rssStyle}>
                <div style={columnStyle}>
    
                    <a href={element.url} className={styles.myTitle} style={titleStyle} target='_blank'>{element.title}</a>
                    <div className={ styles.description } style={descriptionStyle}>{element.description}</div>
             
                    <div>{element.author}</div>
                    {/* <div>{element.url}</div> */}
                </div>
               
              </div>
        );
    };

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
          max={10}
          step={1}
          value={this.state.numberOfNewsItems}
          showValue={true}
          onChange={value => 
            { 
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
      <div className={styles.rssApp}>
        <div className = {styles.column}>
         
          <DefaultButton
            data-automation-id="test"
            text="Settings"
            onClick={this._showPanel}
          /> 
          {this.state.items.map(newsElement)}
          {settingsPanel}
        </div>
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
