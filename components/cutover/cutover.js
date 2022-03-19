// components/cutover/cutover.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cutover:{
      type:Array,
      value:[]
  }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e){
        //console.log(e);
      const {index}=e.currentTarget.dataset;
      //console.log(index);
      this.triggerEvent("tabsIemChange",{index})
    }
  }
})
