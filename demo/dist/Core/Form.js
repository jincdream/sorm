function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { createForm } from '@uform/core';
import isEqual from 'lodash.isequal';
var CustomEventName;

(function (CustomEventName) {
  CustomEventName["ValidatedError"] = "validatedError";
  CustomEventName["SromRest"] = "sormReset";
})(CustomEventName || (CustomEventName = {}));

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
  "date-picker": true,
  "radio-group": true,
  "checkbox-group": true,
  "picker-view": true
};

var Sorm =
/*#__PURE__*/
function () {
  function Sorm() {}

  var _proto = Sorm.prototype;

  _proto.init = function init() {
    this.core = createForm({
      onChange: function onChange(values) {},
      //表单提交事件回调
      onSubmit: function onSubmit(values) {},
      //表单重置事件回调
      onReset: function onReset() {},
      //表单校验失败事件回调
      onValidateFailed: function onValidateFailed(validated) {
        console.log(validated);
      }
    });
  };

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
          childrenSchema = componentSchemaDesc.properties;
      var required = false;

      var field = _this.core.registerField({
        name: thisKey,
        initialValue: cprops.value,
        value: cprops.value,
        rules: rules
      });

      field.getState(function (state) {
        required = state.required;
      });
      cname = cname.toLocaleLowerCase();
      return {
        _supported: Supported[cname],
        component: {
          name: cname,
          props: cprops,
          expression: expression
        },
        required: required,
        hooks: [],
        listening: [],
        keyName: thisKey,
        label: label,
        formType: formType,
        fieldProps: fieldProps,
        childrends: _this.schemaParser(componentSchemaDesc, parentKey),
        getFormCore: function getFormCore() {
          return _this.getCore();
        }
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

var InitForm = function InitForm(ref) {
  var _ref$props = ref.props,
      schema = _ref$props.schema,
      style = _ref$props.style,
      className = _ref$props["class"],
      onSubmit = _ref$props.onSubmit;
  var sorm = ref.sorm;
  sorm.init();
  var formCore = sorm.getCore();
  var components = sorm.parse(schema);
  ref.setData({
    schema: components,
    style: style,
    className: className,
    schemaKey: Date.now().toString(32),
    useButton: !!onSubmit,
    submit: function submit() {
      ref.submit();
    },
    reset: function reset() {
      ref.reset();
    },
    getValues: function getValues() {
      return regeneratorRuntime.async(function getValues$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                sorm.getCore().getFormState(function (state) {
                  resolve(state.values);
                });
              }));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  });
};

export function getFormMixins() {
  var sorm = new Sorm();
  return [{
    didMount: function didMount() {
      this.init = true;
      this.sorm = sorm;
      InitForm(this);
    },
    didUpdate: function didUpdate(props) {
      if (this.init) {
        this.init = false;
        return;
      }

      InitForm(this);
      this.init = true;
    },
    methods: {
      reset: function reset() {
        InitForm(this);
        this.init = true;
      },
      submit: function submit() {
        var core = sorm.getCore();
        var _this$props = this.props,
            onSubmit = _this$props.onSubmit,
            onError = _this$props.onError;
        core.submit(function (res) {
          onSubmit && onSubmit(res);
        })["catch"](function (err) {
          core.notify(CustomEventName.ValidatedError, err);
          onError && onError(err);
        });
      }
    }
  }];
}

var selfValidate = function selfValidate(validate) {
  var res, _res$errors, errors, errData, isError;

  return regeneratorRuntime.async(function selfValidate$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(validate());

        case 2:
          res = _context2.sent;
          _res$errors = res.errors, errors = _res$errors === void 0 ? [] : _res$errors;
          errData = errors[0] || {
            messages: []
          };
          isError = res.errors.length > 0;
          return _context2.abrupt("return", {
            isError: isError,
            errors: errData.messages
          });

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};

export function getFieldMixins() {
  var self;
  return [{
    didMount: function didMount() {
      var _this2 = this;

      var _this$props2 = this.props,
          component = _this$props2.component,
          getFormCore = _this$props2.getFormCore,
          keyName = _this$props2.keyName;
      var core = getFormCore();
      core.subscribe(function _callee(_ref) {
        var type, payload, _filter, _filter$, _filter$$path, path, _filter$$messages, messages, uiValue;

        return regeneratorRuntime.async(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                type = _ref.type, payload = _ref.payload;
                _context3.t0 = type;
                _context3.next = _context3.t0 === CustomEventName.ValidatedError ? 4 : _context3.t0 === CustomEventName.SromRest ? 9 : 12;
                break;

              case 4:
                _filter = (payload || []).filter(function (v) {
                  return v.path === keyName;
                }), _filter$ = _filter[0];
                _filter$ = _filter$ === void 0 ? {} : _filter$;
                _filter$$path = _filter$.path, path = _filter$$path === void 0 ? "" : _filter$$path, _filter$$messages = _filter$.messages, messages = _filter$$messages === void 0 ? [] : _filter$$messages;

                if (path) {
                  _this2.setData({
                    isError: true,
                    errors: messages
                  });
                }

                return _context3.abrupt("break", 13);

              case 9:
                uiValue = (payload || {})[keyName] || "";

                _this2.setData({
                  isError: false,
                  errors: [],
                  uiValue: uiValue,
                  fieldKey: keyName + Date.now()
                });

                return _context3.abrupt("break", 13);

              case 12:
                return _context3.abrupt("break", 13);

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        });
      });
      this.setData({
        uiValue: component.props.value,
        fieldKey: keyName + Date.now()
      });
    },
    methods: {
      onChange: function onChange(e) {
        var _this$props3, getFormCore, keyName, validate, value, core, res;

        return regeneratorRuntime.async(function onChange$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _this$props3 = this.props, getFormCore = _this$props3.getFormCore, keyName = _this$props3.keyName, validate = _this$props3.validate;
                value = e.detail ? e.detail.value : e.value;
                core = getFormCore(); // setFieldValue(value)

                core.setFieldValue(keyName, value);
                _context5.next = 6;
                return regeneratorRuntime.awrap(selfValidate(function _callee2() {
                  return regeneratorRuntime.async(function _callee2$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _context4.next = 2;
                          return regeneratorRuntime.awrap(core.validate(keyName));

                        case 2:
                          return _context4.abrupt("return", _context4.sent);

                        case 3:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  });
                }));

              case 6:
                res = _context5.sent;
                this.setData(_extends({
                  uiValue: value
                }, res));

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, null, this);
      },
      onBlur: function onBlur(e) {},
      onFocus: function onFocus(e) {},
      onConfirm: function onConfirm(e) {},
      onChanging: function onChanging(e) {}
    }
  }];
} // 多选一

export function getFieldGroupMixin() {
  return [{
    didMount: function didMount() {
      var props = this.props.props;
      var _props$dataSource = props.dataSource,
          dataSource = _props$dataSource === void 0 ? [] : _props$dataSource,
          value = props.value;
      var indexValue = 0;
      var labelValue = (dataSource[0] || {}).label || "";

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
          value: formValue
        });
        this.setData({
          indexValue: indexValue,
          value: formValue,
          labelValue: labelValue
        });
      }
    }
  }];
} // 多选多

export function getFieldGroupArrayMixin() {
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
        var _this3 = this;

        // let {limit = Number.MAX_SAFE_INTEGER} = this.props.props
        var indexValue = e.detail.value;

        if (!Array.isArray(indexValue)) {
          return console.error("[value change error]: \u975E\u6570\u7EC4\u503C");
        }

        var values = indexValue.map(function (v, index) {
          return _this3.data.dataSource[index].value;
        }); // if(values.length > limit)return my.alert({
        //   title: `最多只能选择${limit}项`
        // })

        this.props.onChange && this.props.onChange({
          value: values
        });
      }
    }
  }];
}