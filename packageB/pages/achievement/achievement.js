var wxCharts = require("../../../utils/wxcharts.js")
const db = wx.cloud.database();
const _ = db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    array1: [],
    array2: [],
    array3: [],
    array4: [],
    form:"",
    index: 0,
    selected: true,
    selected1: false,
    imageWidth: 0,
    winWidth: '',
    cutover:[
      {
        id:0,
        value:"查询成绩",
        isActive:true,
      },
      {
        id:1,
        value:"成绩分享",
        isActive:false,
      }
    ],
    stuNumber: wx.getStorageSync('stuNumber'),
    stuName: wx.getStorageSync('stuName'),
    stuClass: wx.getStorageSync('stuClass'),
    guanli: wx.getStorageSync('guanli'),
    achievement: [],
    specialtyFraction:[],
    score: 0,
    gradePoint:0,
    specialtyRankings:0,
    classRanking:0,
  },

  //查询
  search() {
    const index = this.data.index;
    db.collection('achievement')
      .where({
        schoolYear: db.RegExp({
          regexp: this.data.array[index],
          options: '/^i/',
        })
      }).get()
      .then(res => {
        console.log(res.data);
        this.setData({
          achievement: res.data,
          specialtyRankings:res.data[0].specialtyRankings,
          classRanking :res.data[0].classRanking
        })
        const array=res.data[0].achievement;
        console.log(array);
        let score=0;
        let gradePoint=0;
        for (let i = 0; i<Object.keys(array).length; i++) {
          //平均分
          score=(score+Number(array[i].achievement)/Object.keys(array).length);
          //平均绩点
          gradePoint=(gradePoint+Number(array[i].gradePoint)/Object.keys(array).length);
          this.setData({
            score:score.toFixed(2),
            gradePoint:gradePoint.toFixed(2)
          })
        }
      })
      .then(res => {
        db.collection("specialtyFraction")
        .where({class:this.data.stuClass})
        .get()
        .then(res=>{
 
          const specialtyFraction=res.data[0]
          this.setData({
            specialtyFraction:specialtyFraction
          })
          console.log(res.data[0]);
          this.analysis(res.data[0])
        })
      })
  },
  prcker(e) {
    this.setData({
      index: Number(e.detail.value)
    })
  },
  prckerxueqi(e) {
    this.setData({
      index: Number(e.detail.value)
    })
  },
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中"
    });
    //获取学生学年
    db.collection('achievement')
      .where({
        stuName: this.data.stuName,
        stuNumber: this.data.stuNumber
      })
      .get()
      .then(res => {
      if (res.data=="") {
        console.log("12312312312");
       this.setData({
          array:["您还没有成绩数据上传呢"]
        })
        wx.hideLoading();
        return
      }
        const array = res.data;
        console.log(array);
        for (let i = 0; i < array.length; i++) {
          this.setData({
            array: this.data.array.concat(array[i].schoolYear),
            array1: this.data.array1.concat(Number(array[i].classRanking)),
            array2: this.data.array2.concat(Number(array[i].specialtyRankings)),
          })

        }
        for (let i = 0; i < array.length; i++) {
          const array1=array[i].achievement;
          console.log(array1);
          let score=0;
          let gradePoint=0;
          for (let j = 0; j < Object.keys(array1).length; j++) {
          //全部平均分
          score=(score+Number(array1[j].achievement)/Object.keys(array).length);
          //全部平均绩点
          gradePoint=(gradePoint+Number(array1[j].gradePoint)/Object.keys(array).length);
          }
          this.setData({
            array3:this.data.array3.concat(Number(score)) ,
            array4:this.data.array4.concat(Number(  gradePoint))
          })
        }
        wx.hideLoading();
      })
    var winWidth = wx.getSystemInfoSync().windowWidth; //获取窗口的宽度
    this.setData({
      width: winWidth
    })
  },
  handleTtabsIemChange(e){
    console.log(e);
    const {index}=e.detail;
    let {cutover}=this.data;
    cutover.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      cutover
   })
   },
  //成绩分析
  analysis(e) {
    const fraction=e.fraction;
    const specialtyFraction=e.specialtyFraction;   
    const gradePoint=e.gradePoint;
    const gradePoints=e.gradePoints;
    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      categories: ['班级平均分', '专业平均分', '班级平均绩点', '专业平均绩点'],
      series: [{
        name: this.data.array[0],
        data: [fraction,specialtyFraction,gradePoint,gradePoints],
      }],
      yAxis: {
        format: function (val) {
          return val;
        },
        max: 100,
        min: 0
      },
      width: 350,
      height: 200
    });
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    let array1=this.data.array1;
    let array2=this.data.array2;
    let array3=this.data.array3;
    let array4=this.data.array4;
    console.log(this.data.array);
    console.log(array1);
    console.log(array2);
    console.log(array3);
    console.log(array4);
    new wxCharts({ //当月用电折线图配置
      canvasId: 'yueEle',
      type: 'line',
      categories:this.data.array, //categories X轴
      animation: true,
      series: [{
        name: '平均分',
        data: array3,
        format: function (val, name) {
          return val + '';
        }
      }, {
        name: '平均绩点',
        data: array4,
        format: function (val, name) {
          return val + '';
        }
      }, {
        name: '班级排名',
        data: array1,
        format: function (val, name) {
          return val + '';
        }
      }, {
        name: '专业排名',
        data: array2,
        format: function (val, name) {
          return val + '';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '',
        format: function (val) {
          return val;
        },
        /*max: 20,*/
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  onShow: function () {

  },
  //选择器更改
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
    })
  },
  //上传成绩
  chengji(e){
    console.log(e.detail.value);
    const schoolYear=e.detail.value.schoolYear;
    const stuClass=e.detail.value.stuClass;
    const stuNumber=e.detail.value.stuNumber;
    const stuName=e.detail.value.stuName;
    const achievement=e.detail.value.achievement;
    const credit=e.detail.value.credit;
    const gradePoint=e.detail.value.gradePoint;
    const nature=e.detail.value.nature;
    const specialty=e.detail.value.specialty;
    db.collection("achievement")
    .where({
      schoolYear:schoolYear,
      stuClass:stuClass,
      stuNumber:stuNumber,
    })
    .get()
    .then(res=>{
      if (res.data[0]!==undefined) {
        console.log(res.data[0]);
        db.collection("achievement")
        .doc(res.data[0]._id)
        .update({
          data: {
            achievement: _.unshift({
               achievement:achievement,
              credit:credit,
              gradePoint:gradePoint,
              nature:nature,
              specialty:specialty,
              classRanking:0,
              specialtyRankings:0,
            })
          }
        })
        .then(res=>{
          this.setData({
            form:""
          })
        })
      }
      else{
        db.collection("achievement")
        .add({
          data: {
            schoolYear,
            stuClass,
            stuName,
            stuNumber,
            achievement:[{
              achievement:achievement,
              credit:credit,
              gradePoint:gradePoint,
              nature:nature,
              specialty:specialty,
            }]
          }
        })
        .then(res=>{
          this.setData({
            form:""
          })
        })
      }
    })
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },
})