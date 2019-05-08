import React, { Component } from 'react';
import Giftprompt from './drawCover/Giftprompt'
import Giftrecord from './drawCover/Giftrecord'
import Times from './drawCover/Times'
import fetchJsonp from 'fetch-jsonp'
import '../assets/css/draw.css'
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
            receiveStatus:false,//中奖领取状态
            myprize:[], //我的奖品
            drawError:false,//抽奖状态
            list: [0, 1, 2, 3, 4, 5],//奖池
            activedId:'',// 被选中的格子的ID
            prizeId: null,// 中奖ID
            times: 0,// 获得prizeId之后计算出的动画次数
            actTimes: 0,// 当前动画次数
            isRolling: false,// 是否正在抽奖
            giftInfo:[],//中奖信息
            baseUrl:"http://rest.zhibo.tv/pa-lottery/",
            tokenId:''//用户token
        };
    }   
    // 关闭弹层
    closeCover = () =>{
        this.setState({
            coverHide:false,
            showRule:false,
            showRecord:false,
            showGift:false,
            showTimes:false,
            showActivity:false,
            drawError:false,
            activedId:'',
            giftInfo:[],
            receiveStatus:false
        })
    }
    //3s关闭弹层!
    triggerClose=(val)=>{
        if(val == true){
            setTimeout(
                ()=>{
                    this.closeCover();
                },3000
            )
        }
    }
    componentWillReceiveProps(){
        
    }
    // 奖品显示!
    recordShow = ()=>{   
        if(this.state.isRolling) return false;
        if(this.state.tokenId === ''){   
            this.checkLogin();
            return false;
        }
        let showRecord = true;
        this.setState({
            coverHide:true,
            showRecord:showRecord
        })
    };
    // 加载用户token!
    componentWillMount(){
        function GetQueryString(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
       }      
       var token='';
       if(GetQueryString("token") !=null && GetQueryString("token").toString().length>1){
          token = GetQueryString("token");
       }  
        this.setState({
            tokenId:token
       })
    }
    checkLogin = ()=>{
        var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {         //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
        if(this.state.tokenId == ''){
            if (browser.versions.android) {
                isnotloginAndriod();
            }
            if (browser.versions.ios) {
                isnotloginios();
            }
        }
        function isnotloginAndriod() {
            if (typeof window.LiveAppJS != 'undefined' && typeof window.LiveAppJS.isnotlogin == 'function'){
                window.LiveAppJS.isnotlogin('111');
            }
            else
            {
                window.location.href = "http://www.zhibo.tv/down/androidapp2";//第三方打开跳转到下载页
            }

        }
        function isnotloginios() {
            try {
                window.webkit.messageHandlers.isnotlogin.postMessage('111');
            }catch(e){
                try {
                    window.location.href = "https://itunes.apple.com/cn/app/zhi-botv-feng-ge-jiong-yi/id1064012897";//第三方打开跳转到下载页
                } catch (e) {
                }
            }
        }
    }
    //点击领奖
    receiveGift=(index,dataId,prize,bool = false)=>{
        //  dataID为传递标识
         let prizeId= dataId;
         let url=this.state.baseUrl+'receive?token='+this.state.tokenId +'&prizeId='+prizeId;
         let trueFalse=bool;
        fetchJsonp(url)
        .then(function(response){
            return response.json()
        }).then((data)=> {
            if(data.status==200){
                let newData = this.state.myprize;  
                newData[index].status = 1;  
                
                if(trueFalse){
                    this.setState({
                        myprize: newData,
                        receiveStatus:true
                    });  
                }else{
                    this.setState({
                        myprize: newData,
                        receiveStatus:false
                    });  
                }
                if(prize == 1){
                    window.location.href="https://m.health.pingan.com/activity/2019/20Waccident_insurance/index.html?isshare=1&re_from=BD_xhzl_zgty&order_from=BD_xhzl_zgty&phone=null"
                }
            }
        }).catch(function(ex) {
            console.log(ex);
            alert('领取失败,请稍候重试！')
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
        if(this.state.tokenId==''){
            this.checkLogin();
            this.setState({
                isRolling:false
            })
            return false;
        }
        let lottery= this.state.baseUrl+'lottery?token='+ this.state.tokenId;
        fetchJsonp(lottery)
        .then(function(response){
            return response.json()
        }).then((data)=> {
             if(data.status == 400){
                this.setState({
                    isRolling:false
                })
                this.checkLogin()
                return false;
             }
             if(data.status == 200){
                let prize = data.data.prizeId - 1;
                let giftdata = data.data;
                this.setState({
                    prizeId: prize,
                    activedId: 0, 
                    giftInfo:giftdata
                })
                this.getGifts();
            }else if(data.status == 505){ 
                // 活动结束显示 
                let showActivity = true;
                this.setState({
                    coverHide:true,
                    showActivity:showActivity,
                    isRolling:false
                })
                return false;
             }else if(data.status == 500){ 
                //  无抽奖次数显示
                let showTimes = true;
                this.setState({
                    coverHide:true,
                    showTimes:showTimes,
                    isRolling:false
                })
                return false;
             }else if(data.status == 501){ 
                //  抽奖失败
                this.setState({
                    coverHide:true,
                    drawError:true,
                    isRolling: false
                })
                return false;
             }
             this.run()
        }).catch(()=> {
            this.setState({
                coverHide:true,
                drawError:true,
                isRolling: false
            })
        })
      }
       run =()=>{
                // 随机算出一个动画执行的最小次数，这里可以随机变更数值，按自己的需求来
                let times = this.state.list.length * Math.floor(Math.random() * 2 + 1)
                this.setState({
                  times: times
                })
                // 抽奖正式开始↓↓
                this.begin = setInterval(() => {
                  let num;    
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
    // 获取我的奖品
    getGifts=()=>{
        let myPrizeUrl=this.state.baseUrl+'my-prize?token='+this.state.tokenId;
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
    
    handleScroll=()=>{       
        let scrollTop  = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;  //滚动条滚动高度
        return scrollTop;
    }
    componentDidUpdate(){
        let scroll=this.handleScroll();
        let docHeight= Math.abs(parseInt(document.querySelector('.m750').clientHeight));
        if(this.state.coverHide){                
            let topDistance=Math.abs(parseInt(document.querySelector('.m750').style.top)) || scroll;
            if(this.state.receiveStatus){}
            if(topDistance == 0){
                topDistance = scroll
            }else if(scroll > docHeight){
                topDistance =0
            }
            document.querySelector('.m750').style.position="fixed";
            document.querySelector('.m750').style.top= - topDistance +'px'           
            document.querySelector('body').style.height=666666 +'px';
            window.scrollTo(0,document.body.scrollHeight)          
        }else{
            let topDistance=Math.abs(parseInt(document.querySelector('.m750').style.top)) || scroll;
            if(topDistance == 0){
                topDistance = scroll
            }else if(topDistance > docHeight){
                topDistance =0
            }           
            document.querySelector('.m750').style.position="static";
            document.querySelector('.m750').style.top=0;
            document.querySelector('body').style.height='auto';
            window.scrollTo(0,topDistance)
        }
    }
    componentDidMount(){
        document.querySelector('.gift-record').addEventListener('touchmove',(e)=>{
            if(this.state.coverHide){
                e.stopPropagation();
            }
        },{passive:false})
        document.querySelector('body').addEventListener('touchmove',(e)=>{
            if(this.state.coverHide){
                e.preventDefault();
            }
        },{passive:false})

        // 抽奖池列表
        let api=this.state.baseUrl+'list';
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
        this.getGifts()
    }
    render() {
        
        return (
            <div className='m750'>
                <div className="prompt-cover" style={{display:this.state.coverHide?"block":"none"}}>
                    <div className="contain">
                        <div className="text" style={{backgroundColor:this.state.receiveStatus?"transparent":"#001213"}}>
                            <span className="close" style={{display:this.state.receiveStatus?"none":"block"}} onClick={this.closeCover}><img src={require('../assets/images/close.png')} /></span>
                            <Giftprompt giftShow={this.state.showGift} giftinfo={this.state.giftInfo} handler={this.receiveGift} receiveStatus={this.state.receiveStatus} close={this.triggerClose}/>
                            <Giftrecord record={this.state.showRecord} myprize={this.state.myprize} handler={this.receiveGift} />
                            <Times times={this.state.showTimes} activity={this.state.showActivity} btn={this.closeCover} draw={this.state.drawError} />
                        </div>
                    </div>
                </div>            
                
                <div className="slogan">
                    <img src={ require('../assets/images/slogan.png')} />
                </div>
                <div className="gifts">
                    <div className="gift-module">
                    <ul>
                        {this.state.giftList.map((value,key)=>{
                            return(
                                <li  key={key} className={this.state.activedId === key? 'on':''} >
                                
                                    <div>
                                        <p><img src={value.img} /></p>
                                        <span>{value.name}</span>
                                    </div>    
                                </li>
                            )
                        })}
                    </ul>
                    </div>
                </div>
                <div className="user-opt">
                    <span><img src={require('../assets/images/mygift.png')} onClick={this.recordShow} /></span>
                    <p><img src={require('../assets/images/btn.png')} onClick={this.handleBegin} id='btn' /></p>
                </div>
                <div className="rules">
                    <div className="title">活动规则</div>
                    <div className="text">
                        1.活动到期时间2019年5月31日。<br />
                        2.活动期间所有中国体育zhibo.tv用户均可参与抽奖，会员每日免费2次，普通用户每日1次；抽奖机会不会累加；普通用户充值为会员身份，需每日零点后生效。<br />
                        3.活动期间抽中奖品，领取完成后将立即生效，如无即时到账，也将会在20个工作日后发放；查看奖品请在活动页右下角“我的抽奖记录”处查看。<br />
                        4.抽中的虚拟礼物跑车、玫瑰请在直播间礼物栏背包中查看，礼物有效期为一个月；抽中会员、赛事观赛卷，彩色弹幕，请在会员中心页查看。<br />
                        5.抽中“平安保险”领取成功，如果存在其他地方领取过，将无法再本活动页领取成功。<br />
                        6.如果出现违规行为，中国体育zhibo.tv将取消您得奖品资格，必要时将追究法律责任。<br />
                        7.若有疑问请联系客服QQ：400-8015553。<br />
                        8.本次活动最终解释权归中国体育zhibo.tv所有。<br />
                    </div>
                </div>
            </div>
        );
    }
}
export default Home;