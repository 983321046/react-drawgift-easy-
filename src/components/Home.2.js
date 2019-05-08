import React, { Component } from 'react';
import coverLayer from './drawCover/CoverLayer'

import fetchJsonp from 'fetch-jsonp'
import CoverLayer from './drawCover/CoverLayer';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showRule:false,//规则开关
            showRecord:false,//我的奖品开关
            showGift:false,//中奖显示开关
            showTimes:false,//次数显示开关
            showActivity:false,//活动显示开关
            giftList:[],
            myprize:[], //我的奖品
            // 九宫格内容list
            list: [0, 1, 2, 3, 4, 5],
            // 被选中的格子的ID
            activedId: '',
            // 中奖ID
            prizeId: null,
            // 获得prizeId之后计算出的动画次数
            times: 0,
            // 当前动画次数
            actTimes: 0,
            // 是否正在抽奖
            isRolling: false,
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
            showRule:showRule
        })
    }
    // 奖品显示
    recordShow =()=>{
        let showRecord = true;
        this.setState({
            showRecord:showRecord
        })
    };
    // 中奖显示
    giftShow=()=>{
        let showGift = true;
        this.setState({
            showGift:showGift
        })
    }
    // 次数显示
    timesShow=()=>{
        let showTimes = true;
        this.setState({
            showTimes:showTimes
        })
    }
    // 活动显示
    activityShow=()=>{
        let showActivity = true;
        this.setState({
            showActivity:showActivity
        })
    }

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
        let lottery= this.state.baseUrl+'lottery?callback=test&token=d8b24eb1c1932390d50431434e95151d*531339'
        fetchJsonp(lottery)
        .then(function(response){
            return response.json()
        }).then((data)=> {
            console.log(data)
             if(data.status == 200){
                let prize = data.prizeId - 1;
                this.setState({
                    prizeId: prize,
                    activedId: 0
                })         
             }else if(data.status == 505){ 
                 let timeout = false;             
                    this.setState({
                        timeOut:timeout,
                    })
             }else if(data.status == 500){ 
                    let drawtime=false;
                    this.setState({
                        drawtimes:drawtime,
                    })
             }
        }).catch(function(reason) {
            console.log('获取失败', reason)
        })
        // 活动结束
        if(this.state.timeOut) {
            this.setState({
                display:"block",
            })
            return false;
        };
        //没有次数
        if(this.state.drawtimes){
            this.setState({
                display:'block',
                timehide:true
            })
            return false;
        }
        if(this.state.prizeId == null){
            return false;
        }
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
        // let prize = 3
        // console.log(prize)
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
    
          if (this.state.activedId === this.state.prizeId && this.state.actTimes > this.state.times) {
            // 符合上述所有条件时才是中奖的时候，两个ID相同并且动画执行的次数大于(或等于也行)设定的最小次数

            clearInterval(this.begin)
            this.setState({
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
        console.log(myPrizeUrl)
        fetchJsonp(myPrizeUrl)
        .then(function(response){
            return response.json()
        }).then((data)=> {
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
                <CoverLayer all={this} />
                <div className="slogan">
                    <img src={require("../assets/images/slogan.png")} />
                    <span className="rule-btn" onClick={this.ruleShow}><img src={require("../assets/images/rule.png")} /></span>
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
                    <span><img src={require("../assets/images/mygift.png")} onClick={this.giftRecordShow} /></span>
                </div>
            </div>
        );
    }
}

export default Home;