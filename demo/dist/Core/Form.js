function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { createForm } from '@uform/core';
import isEqual from 'lodash.isequal';
var Supported = {
  input: true,
  textarea: true,
  radio: true,
  radioGroup: true,
  checkbox: true,
  checkboxGroup: true,
  "switch": true,
  slider: true,
  pickerView: true,
  picker: true,
  view: true,
  "radio-group": true,
  "checkbox-group": true,
  "picker-view": true
};

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

      cname = cname.toLocaleLowerCase();
      return {
        _supported: Supported[cname],
        component: {
          name: cname,
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
        var self = this;
        this.setData({
          uiValue: e.detail.value
        });
      },
      onBlur: function onBlur(e) {},
      onFocus: function onFocus(e) {},
      onConfirm: function onConfirm(e) {},
      onChanging: function onChanging(e) {}
    }
  }];
}
export function getFieldGroupMixin() {
  return [{
    didMount: function didMount() {
      var props = this.props.props;
      var _props$dataSource = props.dataSource,
          dataSource = _props$dataSource === void 0 ? [] : _props$dataSource,
          value = props.value;
      var indexValue = 0;
      var labelValue = dataSource[0].label;

      var _dataSource = dataSource.map(function (v, index) {
        var isDefault = false;

        if (v.value === value) {
          indexValue = index;
          labelValue = v.label;
          isDefault = true;
        }

        return _extends({}, v, {
          id: index,
          isDefault: isDefault
        });
      });

      this.setData({
        dataSource: _dataSource,
        value: value,
        indexValue: indexValue,
        labelValue: labelValue
      });
    },
    methods: {
      onChange: function onChange(e) {
        var indexValue = e.detail.value;
        var valueObj = this.data.dataSource[indexValue];
        var formValue = valueObj.value;
        var labelValue = valueObj.label;
        this.props.onChange && this.props.onChange({
          detail: {
            value: formValue
          }
        });
        this.setData({
          indexValue: indexValue,
          value: formValue,
          labelValue: labelValue
        });
      }
    }
  }];
}
export function getFieldGroupArrayMixin() {
  // 多选值
  return [{
    didMount: function didMount() {
      var props = this.props.props;
      var _props$dataSource2 = props.dataSource,
          dataSource = _props$dataSource2 === void 0 ? [] : _props$dataSource2,
          value = props.value;
      var indexValue = [];
      var isArrayValue = Array.isArray(value);

      if (!isArrayValue) {
        console.error("[value init error]: 非数组值");
      }

      var _dataSource = dataSource.map(function (v, index) {
        var isDefault = false;

        if (isArrayValue) {
          if (value.some(function (defaultValue) {
            return isEqual(defaultValue, v.value);
          })) {
            isDefault = true;
            indexValue.push(index);
          }
        }

        return _extends({}, v, {
          id: index,
          isDefault: isDefault
        });
      });

      this.setData({
        dataSource: _dataSource,
        indexValue: indexValue,
        value: value
      });
    },
    methods: {
      onChange: function onChange(e) {
        var _this2 = this;

        var indexValue = e.detail.value;

        if (!Array.isArray(indexValue)) {
          return console.error("[value change error]: \u975E\u6570\u7EC4\u503C");
        }

        console.log(indexValue, "indexValue");
        this.props.onChange && this.props.onChange({
          detail: {
            value: indexValue.map(function (v, index) {
              return _this2.data.dataSource[index].value;
            })
          }
        });
      }
    }
  }];
}