import React, { Component } from 'react';
class Times extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            timesShowHide:false,
            activityShowHide:false,
            drawStatus:false
        };
    }
    componentWillReceiveProps(nextProps){
        let timesBoolean=nextProps.times;
        let timeOutBoolean=nextProps.activity;
        let drawStatu=nextProps.draw;
        if(timesBoolean){
            this.setState({
                timesShowHide:true
            })
        }else{
            this.setState({
                timesShowHide:false
            })
        }
        if(timeOutBoolean){
            this.setState({
                activityShowHide:true
            })
        }else{
            this.setState({
                activityShowHide:false
            })
        }
        if(drawStatu){
            this.setState({
                drawStatus:true
            })
        }else{
            this.setState({
                drawStatus:false
            })
        }
    }
    promptClose=()=>{

    }
    render() {
        return (
            <div>
                    {/* 没有次数提示 */}
                        <div className="no-times"  style={{display:this.state.timesShowHide?"block":"none"}}>
                            <p className="title">您今天已经没有抽奖机会了</p>
                            <p className="context">明天可继续抽奖哦</p>
                            <div className="btn" onClick={this.props.btn.bind(this)}>好吧</div>
                        </div>                   
                    {/* 活动结束 */}                    
                        <div className="time-out" style={{display:this.state.activityShowHide?"block":"none"}}>
                            <p className="title">大侠来晚一步</p>
                            <p className="context">活动结束啦，下次早点来呀</p>
                            <div className="btn" onClick={this.props.btn.bind(this)}>好吧</div>
                        </div>
                    {/* 抽奖失败 */}                    
                    <div className="time-out" style={{display:this.state.drawStatus?"block":"none"}}>
                        <p className="title">操作提示</p>
                        <p className="context">抽奖失败，请稍候重试！</p>
                        <div className="btn" onClick={this.props.btn.bind(this)}>好吧</div>
                    </div>    
                     
            </div>
        )    
    }
}

export default Times;