import React, { Component } from 'react';

import GiftPrompt from './drawCover/GiftPrompt'
import GiftRecord from './drawCover/GiftRecord'
import Rules from './drawCover/Rules'
import Times from './drawCover/Times'
import fetchJsonp from 'fetch-jsonp'
import { resolve } from 'dns';
import { reject } from 'q';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            giftList:[],
            coverHide:false,
            showRule:false,//规则开关
            showRecord:false,//我的奖品开关
            showGift:false,//中奖显示开关
            showTimes:false,//次数显示开关
            showActivity:false,//活动显示开关
            myprize:[], //我的奖品
            list: [0, 1, 2, 3, 4, 5],//奖池
            activedId:'',// 被选中的格子的ID
            prizeId: null,// 中奖ID
            times: 0,// 获得prizeId之后计算出的动画次数
            actTimes: 0,// 当前动画次数
            isRolling: false,// 是否正在抽奖
            baseUrl:"http://t100-rest.zhibo.tv/pa-lottery/"
            
        };
    }   
    // 关闭弹层
    closeCover=()=>{
        this.setState({
            coverHide:false,
            showRule:false,
            showRecord:false,
            showGift:false,
            showTimes:false,
            showActivity:false
        })
    }
    // 规则显示
    ruleShow=()=>{
        let showRule = true;
        this.setState({
            coverHide:true,
            showRule:showRule
        })
    }
    // 奖品显示
    recordShow =()=>{
        let showRecord = true;
        this.setState({
            coverHide:true,
            showRecord:showRecord
        })
    };
    
    //点击领奖
    receiveGift=(index,dataId)=>{
        //  dataID为传递标识
         const token='d8b24eb1c1932390d50431434e95151d*531339';
         let prizeId= dataId;
         let url=this.state.baseUrl+'receive?callback=test&token='+token +'&prizeId='+prizeId;
         fetchJsonp(url)
        .then(function(response){
            return response.json()
        }).then((data)=> {
            if(data.status==200){
                let newData = this.state.myprize;  
                newData[index].status = 1;  
                this.setState({  
                    myprize: newData  
                });  
            }
        }).catch(function(ex) {
            console.log('领取失败', ex)
        })
    }
    handleBegin=()=> {
        if (!this.state.isRolling) {
          this.setState({
            activedId: '',
            prizeId: null,
            times: 0,
            actTimes: 0,
            isRolling: true
          }, () => {    
            this.handlePlay()  
          })
        }
      }
      handlePlay=()=> {     
        
        console.log("开始抽奖")
        let nowStatus=new Promise((resolve,reject)=>{
            let lottery= this.state.baseUrl+'lottery?callback=test&token=d8b24eb1c1932390d50431434e95151d*531336'
            fetchJsonp(lottery)
            .then(function(response){
                return response.json()
            }).then((data)=> {
                console.log(data)
                data={status:200,data:{id:"25",prizeId:'5',name:'彩色弹幕'}}
                if(data.status == 200){  
                    let prize = data.data.prizeId - 1;
                    console.log("奖品为",prize)
                    this.setState({
                        prizeId: prize,
                        activedId: prize
                    })    
                   console.log(this.state.prizeId)                    
                }else if(data.status == 505){ 
                    // 活动结束显示 
                    let showActivity = true;
                    this.setState({
                        coverHide:true,
                        showActivity:showActivity,
                        isRolling: false
                    })
                }else if(data.status == 500){ 
                    //  无抽奖次数显示
                    let showTimes = true;
                    this.setState({
                        coverHide:true,
                        showTimes:showTimes,
                        isRolling: false
                    })
                }
            }).catch(function(reason) {
                console.log('获取失败', reason)
            })
        })
        nowStatus.then(
            (value)=>{
                console.log(555)
                // let prize = 3
         console.log(this.state)
        // this.setState({
        //   prizeId: prize,
        //   activedId: 0
        // })
                 // 随机算出一个动画执行的最小次数，这里可以随机变更数值，按自己的需求来
        let times = this.state.list.length * Math.floor(Math.random() * 5 + 3)
        this.setState({
            times: times
        })
        // 抽奖正式开始↓↓
        this.begin = setInterval(() => {
        let num;    
        console.log(num)
        if (this.state.activedId === this.state.prizeId && this.state.actTimes > this.state.times) {
            // 符合上述所有条件时才是中奖的时候，两个ID相同并且动画执行的次数大于(或等于也行)设定的最小次数
            clearInterval(this.begin)
            let showGift = true;
            this.setState({
                coverHide:true,
                showGift:showGift,
                isRolling: false
            })
            return
        }
            // 以下是动画执行时对id的判断
        if (this.state.activedId === '') {
            num = 0
            this.setState({
            activedId: num
            })
        } else {
            num = this.state.activedId
            if (num === 5) {
            num = 0
            this.setState({
                activedId: num
            })
            } else {
            num = num + 1
            this.setState({
                activedId: num
            })
            }
        }
        this.setState({
            actTimes: this.state.actTimes + 1
        })
        }, 200)       
            }
        ).catch((err)=>{
            console.log(err)
        })      












        

        
      }
    
    
    componentDidMount(){
        
        // 抽奖池列表
        let api=this.state.baseUrl+'list?callback=test';
        fetchJsonp(api)
        .then(function(response){
            return response.json()
        }).then((data)=> {
            if(data.status==200){
                this.setState({
                    giftList:data.data
                }) 
            }
        }).catch(function(reason) {
            console.log('获取失败', reason)
        })
        // 获取我的奖品
        let myPrizeUrl=this.state.baseUrl+'my-prize?callback=test&token=d8b24eb1c1932390d50431434e95151d*531339';
        
        fetchJsonp(myPrizeUrl)
        .then(function(response){
            return response.json()
        }).then((data)=> {
            console.log(data)
            if(data.status==200){
                this.setState({
                    myprize:data.data
                }) 
            }
        }).catch(function(reason) {
            console.log('获取失败', reason)
        })
    }
    render() {
        return (
            <div className='m750'>
                <div className="prompt-cover" style={{display:this.state.coverHide?"block":"none"}}>
                    <div className="contain">
                        <div className="text">
                            <span className="close" onClick={this.closeCover}><img src={require("../assets/images/close.png")} /></span>
                            <GiftPrompt giftprompt={this.state.showGift}/>
                            <GiftRecord record={this.state.showRecord} myprize={this.state.myprize} handler={this.receiveGift} />
                            <Times times={this.state.showTimes} activity={this.state.showActivity} btn={this.closeCover} surplusTimes={this.surplusTimes} whetherTimeOut={this.whetherTimeOut} />
                            <Rules rule={this.state.showRule}/>
                        </div>
                    </div>
                </div>            
                
                <div className="slogan">
                    <img src={require("../assets/images/slogan.png")} />
                    <span className="rule-btn" onClick={this.ruleShow.bind(this)}><img src={require("../assets/images/rule.png")} /></span>
                </div>
                <div className="gifts">
                    <ul>
                        {this.state.giftList.map((value,key)=>{
                            return(
                                <li  key={key} className={this.state.activedId == key?'on':''} >
                                    <div>
                                        <p><img src={value.img} /></p>
                                        <span>{value.name}</span>
                                    </div>    
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="user-opt">
                    <p><img src={require("../assets/images/btn.png")} onClick={this.handleBegin} id='btn' /></p>
                    <span><img src={require("../assets/images/mygift.png")} onClick={this.recordShow} /></span>
                </div>
            </div>
        );
    }
}

export default Home;