import React, { Component } from 'react';
import moment from "moment";

class Giftrecord extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            dataList:[],
            showHide:false
         };
    }
    componentWillReceiveProps(nextProps){
        let showBoolean=nextProps.record;
        let data=nextProps.myprize;
        if(showBoolean){
            this.setState({
                showHide:true,
                dataList:data
            })
        }else{
            this.setState({
                showHide:false
            })
        }
    }
    render() {
        return (
            <div className="gift-record" style={{display:this.state.showHide?"block":"none"}} >
                <div className="title">我的奖品</div>
                
                    {
                        this.state.dataList.length>=1?
                        <ul>
                            {
                                this.state.dataList.map((value,key)=>{
                                    return(
                                        <li key={key}>
                                            <dl>
                                                <dt>{value.name}</dt>
                                                <dd>时间：{moment(value.add_time).format("YYYY-MM-DD HH:mm")}</dd>
                                            </dl>
                                            {
                                                value.status==0?<span onClick={this.props.handler.bind(this,key,value.id,value.prize_id,false)}>领取</span>:<span className="get">已领取</span>
                                            }                                   
                                        </li>
                                    )
                                })
                            }
                        </ul>:<p className="no-data">您还没有抽到奖品喔~</p>
                    }
                    
                
            </div>
        );
    }
}

export default Giftrecord;