import {
  IFormOption,
  ISchema,
  ISormComponents,
  IMixin,
  IFieldProps,
  IFormProps,
  ISchemaPareserResult,
  ISupportedFormItem,
  IAPP,
  IFieldGroupProps
} from './Share'

import {createForm} from '@uform/core'
import isEqual from 'lodash.isequal'

const Supported: ISupportedFormItem = {
  input: true,
  textarea: true,
  radio: true,
  radioGroup: true,
  checkbox: true,
  checkboxGroup: true,
  switch: true,
  slider: true,
  pickerView: true,
  picker: true,
  view: true,
  "date-picker": true,
  "radio-group": true,
  "checkbox-group": true,
  "picker-view": true
}
class Sorm {
  constructor(){
    this.fieldComponents = {}
    this.initValue = {}
    this.core = createForm({
      onChange: (values) => {

      },
      //表单提交事件回调
      onSubmit: (values) => {

      },
      //表单重置事件回调
      onReset: () => {

      },
      //表单校验失败事件回调
      onValidateFailed:(validated) => {

      }
    })
  }
  private initValue: any
  private core: any
  private fieldComponents: any
  private _schema: ISchema
  private schemaParser(schema:ISchema,parentKey?: string): Array<ISormComponents> {
    let {properties = {}} = schema
    let keys:Array<string> = Object.keys(properties)
    
    return  keys.map((keyName,index)=>{
      let componentSchemaDesc = properties[keyName]
      let thisKey = parentKey ? parentKey + '.' + keyName : keyName
      let {
        type: formType,
        title: label,
        "x-component": cname = "view",
        "x-component-props": cprops = {},
        "x-component-props-expression": expression,
        "x-props": fieldProps,
        "x-rules": rules,
        properties: childrenSchema
      } = componentSchemaDesc
      // this.initValue[thisKey] = cprops.value
      
      this.core.registerField({
        name: thisKey,
        initialValue: cprops.value,
        value: cprops.value,
        rules: rules
      })
      cname = cname.toLocaleLowerCase()
      return {
        _supported: Supported[cname],
        component: {
          name: cname,
          props: cprops,
          expression
        },
        hooks: [],
        listening: [],
        keyName: thisKey,
        label,
        formType,
        fieldProps,
        childrends: this.schemaParser(componentSchemaDesc,parentKey),
        saveRef: (ref)=>{
          this.fieldComponents[cname] = ref
        },
        fieldEmmiter: ()=>{},
        fieldListener: ()=>{}
      }
    })
  }
  /**
   * getValues
   */
  public getValues() {
    return this.initValue
  }
  public getCore(){
    return this.core
  }
  parse(schema:ISchema):Array<ISormComponents>{
    this._schema = schema
    return this.schemaParser(schema)
  }
}
export function getFormMixins(){
  let sorm = new Sorm()
  let self
  return [{
    didMount(){
      self = this
      let {
        schema,
        style,
        class: className
      } = this.props
      let formCore = sorm.getCore()
      let components = sorm.parse(schema)
      console.log(components)
      this.setData({
        schema: components,
        style,
        className
      })
      
    },
    methods: {
      
    }
  } as IMixin<IFormProps>]
}
export function getFieldMixins(){
  let self
  return [{
    didMount(){
      let {
        fieldEmmiter,
        fieldListener,
        component,
        saveRef
      } = this.props
      saveRef(this)
      self = this
      self.setData({
        uiValue: component.props.value
      })
    },
    methods: {
      onChange(e){
        console.log(e)
        let self = this
        this.setData({
          uiValue: e.detail.value
        })
      },
      onBlur(e){},
      onFocus(e){},
      onConfirm(e){},
      onChanging(e){}
    } as IAPP
  } as IMixin<IFieldProps>]
}
export function getFieldGroupMixin(){
  return [{
    didMount(){
      let {props} = this.props
      let {dataSource = [],value} = props
      let indexValue = 0
      let labelValue = (dataSource[0] || {}).label || ""
      
      let _dataSource = dataSource.map((v,index)=>{
        let isDefault = false
        if(v.value === value){
          indexValue = index
          labelValue = v.label
          isDefault = true
        }
        return {
          ...v,
          id: index,
          isDefault
        }
      })
      this.setData({
        dataSource: _dataSource,
        value,
        indexValue,
        labelValue
      })

    },
    methods: {
      onChange(e){
        let {value: indexValue} = e.detail
        let valueObj = this.data.dataSource[indexValue]
        let formValue = valueObj.value
        let labelValue = valueObj.label
        this.props.onChange && this.props.onChange({
          detail:{
            value: formValue
          }
        })
        this.setData({
          indexValue,
          value: formValue,
          labelValue
        })
      }
    } as IAPP
  } as IMixin<IFieldGroupProps<string>>]
}
export function getFieldGroupArrayMixin(){
  // 多选值
      
  return [{
    didMount(){
      let {props} = this.props
      let {dataSource = [],value} = props
      let indexValue = []
      let isArrayValue = Array.isArray(value)
      if(!isArrayValue){
        console.error("[value init error]: 非数组值")
      }
      let _dataSource = dataSource.map((v,index)=>{
        let isDefault = false
        if(isArrayValue){
          if(value.some( defaultValue => isEqual(defaultValue,v.value))){
            isDefault = true
            indexValue.push(index)
          }
        }
        return {
          ...v,
          id: index,
          isDefault
        }
      })

      this.setData({
        dataSource: _dataSource,
        indexValue,
        value
      })
    },
    methods: {
      onChange(e){
        let {value: indexValue} = e.detail
        if(!Array.isArray(indexValue)){
          return console.error(`[value change error]: 非数组值`)
        }
        console.log(indexValue,"indexValue")
        this.props.onChange && this.props.onChange({
          detail:{
            value: indexValue.map((v,index) => this.data.dataSource[index].value) 
          }
        })
      }
    } as IAPP
  } as IMixin<IFieldGroupProps<Array<any>>> ]
}