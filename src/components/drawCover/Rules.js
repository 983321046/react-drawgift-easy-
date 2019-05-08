import React, { Component } from 'react';
class Rules extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            showHide:false
        };
    }
    componentWillReceiveProps(nextProps){
        let showBoolean=nextProps.rule;
        if(showBoolean){
            this.setState({
                showHide:true
            })
        }else{
            this.setState({
                showHide:false
            })
        }
    }
    render() {
        return (          
            <div className="rules" style={{display:this.state.showHide?"block":"none"}}>
                <div className="title">活动规则</div>
                <div style={{fontSize:"0.22rem",lineHeight:1.65}}>1.活动页抽奖时间根据官方定义。<br />

2.活动期间所有中国体育直播用户均可参与抽奖，会员每日免费5次，普通用户每日3次。<br />

3.活动期间抽中任意奖品，领取完成后将立即生效。 <br />

4.如果出现违规行为，中国体育直播将取消您得奖品资格，必要时将追究法律责任。<br />

5.特别提示“平安保险”只限领取一次，如果存在其他地方领取过，将无法再本活动页领取成功。<br />

6.若有疑问请联系客服QQ：400-8015553<br />

7.本次活动最终解释权归中国体育直播所有。</div>
            </div>
        );
    }
}

export default Rules;