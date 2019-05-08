import React, { Component } from 'react';
import { timingSafeEqual } from 'crypto';


class Giftinformation extends Component {
    state = { 
        giftInfo:[],
     }
    render() {
        return (
            <div>
                <p className="title">恭喜您获得</p>
                {
                    this.state.giftInfo.map((value,key)=>{
                        return(
                            <div key={key}>
                                <p className="gift-name">{ value.name}</p>
                                <p className="gift-img"><img src={value.img} /></p>
                                <p className="prompt-text">{value.desc}</p>
                                <div className="btn"  onClick={this.props.handler.bind(this,key,value.id,value.prizeId)}>领取</div>                               
                            </div> 
                        )
                    })
                }
            </div>
        );
    }
}




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
        console.log(nextProps)
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
                {
                    this.state.receiveStatus?<div className="btn" style={{"backgroundColor":"#f9c9b2"}}>已领取</div>:<Giftinformation giftinfo={this.state.giftInfo} />
                }
            </div>
        );
    }
}

export {Giftprompt,Giftinformation};
