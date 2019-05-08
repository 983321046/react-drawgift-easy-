import React, { Component } from 'react';
import GiftPrompt from './draw/GiftPrompt'
import GiftRecord from './draw/GiftRecord'
import Rules from './draw/Rules'
import Times from './draw/Times'
import fetchJsonp from 'fetch-jsonp'





// window.onload =function(){
//     var stopNum,//停止数
//         index=0,//当前亮区位置
//         prevIndex, //前一位置
//         speed=300,//初始速度
//         timer,//定时器对象
//         downIndex=0,           //决定在哪一格变慢
//         cycle=0,           //转动圈数   
//         EndCycle=0,           //设置转几圈后再减速
//         flag=false,           //结束转动标志 为true时停止 
//         speedUp=0,           //加速
//         target=document.querySelector('.gifts'),
//         li = target.querySelectorAll("li"),     //获取tb对象 
//         btn = document.getElementById("btn"),
//         switchBtn = true,
//         runArr=6;
//         console.log(li)
//     function start(){
//         switchBtn = false;
//         stopNum = 1;//点击产生随机数，最后将停在次数上
//         downIndex=3;
//         console.log(stopNum,downIndex)
//         EndCycle=3;
//         clearInterval(timer);
//         cycle=0;
//         flag=false;//结束转动标志
//         timer=setInterval(run,speed);//启动定时器
//     }
//     function change(){
//         li[index].className='on'; //给当前单元格添加样式，换高亮的背景色；
//         if(index>0){
//                 prevIndex=index-1;//前一位置
//         }
//         else{
//             prevIndex=runArr-1;
//         }
//         li[prevIndex].className='';//光标走过后恢复背景色；
//         index++;
//         speedUp++;
//     }
//     //运行函数
//     function run(){
//         change();//背景变化函数
//         //跑马灯加速
//         if(flag==false){
//             if(speedUp==5){   		  //走5格后加速
//                 clearInterval(timer); //先清除定时器，再改变速度
//                 speed=100;
//                 timer=setInterval(run,speed);
//             }
//         }
//             //跑N圈后减速
//         if(cycle==EndCycle+1 && index==downIndex){
//             clearInterval(timer);
//             speed=500;
//             flag=true;       //触发结束			 
//             timer=setInterval(run,speed);//减速
//         }
//             //计算转了几圈
//         if(index>=runArr){
//             index=0;
//             cycle++;
//             console.log("圈数",cycle)
//         }
//         //停止并选中号码
//         if(flag==true && index==stopNum){ 
//             console.log("当前index",index )
//             speedUp=0;
//             clearInterval(timer);
//             switchBtn = true;
//         }
//     }
//     btn.onclick=function(){
//         if(switchBtn){
//             start();
//         }else{
//             console.log("不能点")
//             return false;
//         }
        
//     }
// }










class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            giftList:[],
            display:'none',
            rulehide:false,//规则开关
            times:false,//次数不为0
            timeOut:false,//活动未结束
            timehide:false,//活动次数开关
            timeouthide:false,//活动结束开关
            giftprompt:false,//抽奖开关
            giftRecord:false,//抽奖记录开关
            myprize:[] //我的奖品
        };
    }   
    // 关闭弹层
    closeCover=()=>{
        this.setState({
            display:'none',
            rulehide:false,
            timehide:false,
            timeouthide:false,
            giftprompt:false,
            giftRecord:false
        })
    }
    // 规则展示
    ruleShow=()=>{
        this.setState({
            display:'block',
            rulehide:true
        })
    }
    // 我的奖品显示
    giftRecordShow =()=>{
        this.setState(
            {
                display:'block',
                giftRecord:true
            }
        )
    };
    // 剩余次数
    surplusTimes =(val)=>{
        this.setState(
            {
                display:'none',
                timehide:val
            }
        )
    };
    // 是否活动结束
    whetherTimeOut =(val)=>{
        this.setState({
            display:'none',
            timeouthide:val
        })
    }
    giftBegin=()=>{
        //活动结束
        if(this.state.timeOut) {
            this.setState({
                display:"block",
            })
            return false;
        };
        //没有次数
        if(this.state.times){
            this.setState({
                display:'block',
                timehide:true
            })
            return false;
        }
        
    }  
    //点击领奖
    receiveGift=(index,dataId)=>{
        //  dataID为传递标识
         const token='d8b24eb1c1932390d50431434e95151d*531339';
         let prizeId= dataId;
         let url='http://t100-rest.zhibo.tv/pa-lottery/receive?callback=test&token='+token +'&prizeId='+prizeId;
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
    componentDidMount(){
        // 抽奖池列表
        let api='http://t100-rest.zhibo.tv/pa-lottery/list?callback=test';
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
        let myPrizeUrl='http://t100-rest.zhibo.tv/pa-lottery/my-prize?callback=test&token=d8b24eb1c1932390d50431434e95151d*531339';
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
                <div className="prompt-cover" style={{display:this.state.display}}>
                    <div className="contain">
                        <div className="text">
                            <span className="close" onClick={this.closeCover}><img src={require("../assets/images/close.png")} /></span>
                            <GiftPrompt giftprompt={this.state.giftprompt}/>
                            <GiftRecord giftrecord={this.state.giftRecord} myprize={this.state.myprize} handler={this.receiveGift}/>
                            <Times times={this.state.timehide} timeout={this.state.timeouthide} surplusTimes={this.surplusTimes} whetherTimeOut={this.whetherTimeOut} />
                            <Rules ruleshow={this.state.rulehide}/>
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
                                <li  key={key} >
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
                    <p><img src={require("../assets/images/btn.png")} onClick={this.giftBegin} id='btn' /></p>
                    <span><img src={require("../assets/images/mygift.png")} onClick={this.giftRecordShow} /></span>
                </div>
            </div>
        );
    }
}

export default Home;