Page({
  data: {
    schema: {
      "type": "object",
      "title": "我是表单标题",
      "description": "我是表单描述",
      "properties": {
        "custom": {
          "x-component": "custom"
        },
        "input": {
          "type": "string",
          "title": "输入框",
          "default": "xxx",
          "description": "我是字段描述",
          "x-props" : {
            
          },
          // 解析 x-component
          "x-component": "input",
          "x-component-props": {
            // "value": "{{root.fieldA === 'xxx' ? 0 : 1}}",
            "disabled": "{{root.value.switch == true}}", //支持嵌套字段值获取，支持JS原生方法、逻辑表达式
          },
          "x-rules": [{
            // "required": true
          }]
        },
        "textarea": {
          "type": "string",
          "title": "多行输入",
          "default": "xxx",
          "description": "我是字段描述",
          "x-props" : {
            
          },
          // 解析 x-component
          "x-component": "textarea",
          "x-component-props": {
            "value": "输入值",
            // "disabled": "{{root.fieldA > root.fieldB}}", //支持嵌套字段值获取，支持JS原生方法、逻辑表达式
          },
          "x-rules": [{
            "required": true
          }]
        },
        "radio-group": {
          "type": "string",
          "title": "单选按钮",
          "default": "xxx",
          "description": "我是字段描述",
          "x-props" : {
            
          },
          "x-component": "radio-group",
          "x-component-props": {
            "value":"angular",
            "disabled": "{{root.value.switch == true}}", //支持嵌套字段值获取，支持JS原生方法、逻辑表达式
            "dataSource": [
              { "value": "angular", "label": "AngularJS", "color": "red" },
              { "value": "react", "label": "React" },
              { "value": "polymer", "label": "Polymer" },
              { "value": "vue", "label": "Vue.js" },
              { "value": "ember", "label": "Ember.js" },
              { "value": "backbone", "label": "Backbone.js", "disabled": true },
            ]
          },
          "x-rules": [{
            "required": true
          }]
        },
        "checkbox-group": {
          "type": "string",
          "title": "多项选择",
          "default": "xxx",
          "description": "我是字段描述",
          "x-props" : {
            
          },
          "x-component": "checkbox-group",
          "x-component-props": {
            "limit": 2,
            "value":["react","vue"],
            "dataSource": [
               { "value": "angular", "label": "AngularJS", "color": "red" },
              { "value": "react", "label": "React"},
              { "value": "polymer", "label": "Polymer" },
              { "value": "vue", "label": "Vue.js" },
              { "value": "ember", "label": "Ember.js" },
              { "value": "backbone", "label": "Backbone.js", "disabled": true },
            ]
          },
          "x-rules": [{
            "required": true
          }]
        },
        "switch": {
          "type": "string",
          "title": "开关",
          "default": "xxx",
          "description": "我是字段描述",
          "x-props" : {
            
          },
          "x-component": "switch",
          "x-component-props": {
            "value": true
          },
          "x-rules": [{
            "required": true
          }]
        },
        "slider": {
          "type": "string",
          "title": "滑动选择",
          "default": "xxx",
          "description": "我是字段描述",
          "x-props" : {
            
          },
          "x-component": "slider",
          "x-component-props": {
            "min": 10,
            "step": 10,
            "max": 100,
            "show-value": true
          },
          "x-rules": [{
            "required": true
          }]
        },
        "date-picker": {
          "type": "string",
          "title": "日期选择",
          "default": "xxx",
          "description": "我是字段描述",
          "x-props" : {
            
          },
          "x-component": "date-picker",
          "x-component-props": {
            "value": "1575613980000",
            /**
             *  yyyy-MM-dd 默认
             *  HH:mm
                yyyy-MM-dd HH:mm
                yyyy-MM（最低基础库：1.1.1，可用 canIUse('datePicker.object.format.yyyy-MM') 判断）
                yyyy（最低基础库：1.1.1，可用 canIUse('datePicker.object.format.yyyy') 判断）
             */
            "format": "yyyy-MM-dd HH:mm",
            // 格式跟 format 的一样
            // "currentDate": "2019-11-18",
            // "startDate": "2019-11-01",
            // "endDate": "2019-12-18",
            "valueType": "timestamp" // format default
          },
          "x-rules": [{
            "required": true
          }]
        },
        "picker": {
          "type": "string",
          "title": "下拉选择",
          "default": "xxx",
          "description": "我是字段描述",
          "x-props" : {
            
          },
          "x-component": "picker",
          "x-component-props": {
            "value":"react",
            "dataSource":[
              { "value": "angular", "label": "AngularJS", "color": "red" },
              { "value": "react", "label": "React" },
              { "value": "polymer", "label": "Polymer" },
              { "value": "vue", "label": "Vue.js" },
              { "value": "ember", "label": "Ember.js" },
              { "value": "backbone", "label": "Backbone.js", "disabled": true },
            ]
          },
          "x-rules": [{
            "required": true
          }]
        }
      }
    }
  },
  changeSchema(){
    this.data.schema.properties.custom["x-component"] = "input"
    this.setData({
      schema: {...this.data.schema}
    })
    
  },
  onLoad(query) {
    
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
  formSubmit(res){
    console.log(res)

    my.alert({
      title: "提交成功"
    })
  }
});
