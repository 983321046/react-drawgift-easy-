import React, { Component } from 'react';
class Giftprompt extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            showHide:false,
            receiveStatus:false,
            giftInfo:[],
        };
    }
    componentWillReceiveProps(nextProps){
        let showBoolean=nextProps.giftShow;
        let gift=nextProps.giftinfo;
        let status=nextProps.receiveStatus;
        let giftInfo=[];
            giftInfo.push(gift)
        if(showBoolean){
            this.setState({
                showHide:showBoolean,
                giftInfo:giftInfo,
                receiveStatus:status
            })
            if(status){
                this.props.close(true);
            }
        }else{
            this.setState({
                showHide:false,
                giftInfo:[],
                receiveStatus:false
            })
        }
    }
    render() {
        return (
            <div className="gift-prompt" style={{display:this.state.showHide?"block":"none"}}>
                <p className="title" style={{display:this.state.receiveStatus?"none":"block"}}>恭喜您获得</p>
            {
                this.state.receiveStatus? 
                    <div className="btn receive">已领取</div>:
                        this.state.giftInfo.map((value,key)=>{
                            return(
                                <div key={key}>
                                    <p className="gift-name">{ value.name}</p>
                                    <p className="gift-img"><img src={ value.img} /></p>
                                    <p className="prompt-text">{value.desc}</p>
                                    <div className="btn"  onClick={this.props.handler.bind(this,key,value.id,value.prizeId,true)}>领取</div>                                    
                                </div> 
                            )
                        })                      
            }
                                          
            </div>
        );
    }
}

export default Giftprompt;