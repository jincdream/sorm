Page({
  data: {
    schema: {
      "type": "object",
      "title": "我是表单标题",
      "description": "我是表单描述",
      "properties": {
        // "fieldA": {
        //   "type": "number",
        //   "title": "字段A"
        // },
        // "fieldB": {
        //   "type": "number",
        //   "title": "字段B"
        // },
        "custom":{
          "type": "string",
          "title": "自定义",
          "x-component": "customs",
          "x-component-props": {}
        },
        "name": {
          "type": "string",
          "title": "姓名",
          "default": "xxx",
          "description": "我是字段描述",
          "x-props" : {
            
          },
          // 解析 x-component
          "x-component": "Input",
          "x-component-props": {
            // "value": "{{root.fieldA === 'xxx' ? 0 : 1}}",
            // "disabled": "{{root.fieldA > root.fieldB}}", //支持嵌套字段值获取，支持JS原生方法、逻辑表达式
          },
          "x-rules": [{
            "required": true
          }]
        }
      }
    }
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
});
