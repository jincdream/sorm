import { createForm } from '@uform/core';

var Sorm =
/*#__PURE__*/
function () {
  function Sorm() {
    this.fieldComponents = {};
    this.initValue = {};
    this.core = createForm({
      onChange: function onChange(values) {},
      //表单提交事件回调
      onSubmit: function onSubmit(values) {},
      //表单重置事件回调
      onReset: function onReset() {},
      //表单校验失败事件回调
      onValidateFailed: function onValidateFailed(validated) {}
    });
  }

  var _proto = Sorm.prototype;

  _proto.schemaParser = function schemaParser(schema, parentKey) {
    var _this = this;

    var _schema$properties = schema.properties,
        properties = _schema$properties === void 0 ? {} : _schema$properties;
    var keys = Object.keys(properties);
    return keys.map(function (keyName, index) {
      var componentSchemaDesc = properties[keyName];
      var thisKey = parentKey ? parentKey + '.' + keyName : keyName;
      var formType = componentSchemaDesc.type,
          label = componentSchemaDesc.title,
          _componentSchemaDesc$ = componentSchemaDesc["x-component"],
          cname = _componentSchemaDesc$ === void 0 ? "view" : _componentSchemaDesc$,
          _componentSchemaDesc$2 = componentSchemaDesc["x-component-props"],
          cprops = _componentSchemaDesc$2 === void 0 ? {} : _componentSchemaDesc$2,
          expression = componentSchemaDesc["x-component-props-expression"],
          fieldProps = componentSchemaDesc["x-props"],
          rules = componentSchemaDesc["x-rules"],
          childrenSchema = componentSchemaDesc.properties; // this.initValue[thisKey] = cprops.value

      _this.core.registerField({
        name: thisKey,
        initialValue: cprops.value,
        value: cprops.value,
        rules: rules
      });

      return {
        component: {
          name: cname.toLocaleLowerCase(),
          props: cprops,
          expression: expression
        },
        hooks: [],
        listening: [],
        keyName: thisKey,
        label: label,
        formType: formType,
        fieldProps: fieldProps,
        childrends: _this.schemaParser(componentSchemaDesc, parentKey),
        saveRef: function saveRef(ref) {
          _this.fieldComponents[cname] = ref;
        },
        fieldEmmiter: function fieldEmmiter() {},
        fieldListener: function fieldListener() {}
      };
    });
  }
  /**
   * getValues
   */
  ;

  _proto.getValues = function getValues() {
    return this.initValue;
  };

  _proto.getCore = function getCore() {
    return this.core;
  };

  _proto.parse = function parse(schema) {
    this._schema = schema;
    return this.schemaParser(schema);
  };

  return Sorm;
}();

export function getFormMixins() {
  var sorm = new Sorm();
  var self;
  return [{
    didMount: function didMount() {
      self = this;
      var _this$props = this.props,
          schema = _this$props.schema,
          style = _this$props.style,
          className = _this$props["class"];
      var formCore = sorm.getCore();
      var components = sorm.parse(schema);
      console.log(components);
      this.setData({
        schema: components,
        style: style,
        className: className
      });
    },
    methods: {}
  }];
}
export function getFieldMixins() {
  var self;
  return [{
    didMount: function didMount() {
      var _this$props2 = this.props,
          fieldEmmiter = _this$props2.fieldEmmiter,
          fieldListener = _this$props2.fieldListener,
          component = _this$props2.component,
          saveRef = _this$props2.saveRef;
      saveRef(this);
      self = this;
      self.setData({
        uiValue: component.props.value
      });
    },
    methods: {
      onChange: function onChange(e) {
        console.log(e);
        self.setData({
          uiValue: e.detail.value
        });
      },
      onBlur: function onBlur(e) {},
      onFocus: function onFocus(e) {},
      onConfirm: function onConfirm(e) {}
    }
  }];
}