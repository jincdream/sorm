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
  IFieldGroupProps,
  IValidate
} from './Share'

import {createForm, IForm, LifeCycleTypes} from '@uform/core'
import isEqual from 'lodash.isequal'

enum CustomEventName {
  ValidatedError = "validatedError",
  SromRest = 'sormReset'
}

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
        console.log(validated)
      }
    })
  }
  private initValue: any
  private core: IForm
  private _schema: ISchema
  private schemaParser(schema:ISchema,parentKey?: string): Array<ISormComponents> {
    let {properties = {}} = schema
    let keys:Array<string> = Object.keys(properties)
    let {core} = this
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

      let required = false

      let field = core.registerField({
        name: thisKey,
        initialValue: cprops.value,
        value: cprops.value,
        rules: rules
      })
      field.getState((state)=>{
        required = state.required
      })

      cname = cname.toLocaleLowerCase()
      return {
        _supported: Supported[cname],
        component: {
          name: cname,
          props: cprops,
          expression
        },
        required,
        hooks: [],
        listening: [],
        keyName: thisKey,
        label,
        formType,
        fieldProps,
        childrends: this.schemaParser(componentSchemaDesc,parentKey),
        getFormCore:()=>{
          return core
        },
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
  return [{
    didMount(){
      let {
        schema,
        style,
        class: className
      } = this.props
      let formCore = sorm.getCore()
      let components = sorm.parse(schema)
      this.setData({
        schema: components,
        style,
        className
      })
      
    },
    methods: {
      reset(){
        let { onReset } = this.props
        let core = sorm.getCore()
        core.reset().then(()=>{
          core.getFormState(state => {
            core.notify(CustomEventName.SromRest,state.initialValues)
            onReset && onReset(state.initialValues)
          })
        })
      },
      submit(e){
        let core = sorm.getCore()
        let { onSubmit, onError } = this.props
       
        core.submit((res)=>{
          onSubmit && onSubmit(res)
        }).catch(err=>{
          core.notify(CustomEventName.ValidatedError,err)
          onError && onError(err)
        })
      }
    } as IAPP
  } as IMixin<IFormProps>]
}

const selfValidate = async function(validate:IValidate){
  let res = await validate()
  let { errors = [] } = res
  let errData = errors[0] || {messages:[]}
  let isError = res.errors.length > 0
  return {
    isError,
    errors: errData.messages
  }
}

export function getFieldMixins(){
  let self
  return [{
    didMount(){
      let {
        component,
        getFormCore,
        keyName
      } = this.props

      let core = getFormCore()
      core.subscribe(async ({
        type,
        payload
      })=>{
        switch(type){
          case CustomEventName.ValidatedError:
            let [{path = "",messages = []} = {}] = (payload || []).filter(v => v.path === keyName)
            if(path){
              this.setData({
                isError: true,
                errors: messages
              })
            }
            break;
          case CustomEventName.SromRest:
            let uiValue = (payload || {})[keyName] || ""
            this.setData({
              isError: false,
              errors: [],
              uiValue,
              fieldKey: keyName + Date.now()
            })
            break;
          default:
            break;
        }
      })

      this.setData({
        uiValue: component.props.value,
        fieldKey: keyName + Date.now()
      })
    },
    methods: {
      async onChange(e){
        let {
          getFormCore,
          keyName,
          validate,
        } = this.props
        let value = e.detail ? e.detail.value : e.value
        let core = getFormCore()
        // setFieldValue(value)
        core.setFieldValue(keyName,value)
        let res = await selfValidate(async ()=>{
          return await core.validate(keyName)
        })
        this.setData({
          uiValue: value,
          ...res
        })
      },
      onBlur(e){},
      onFocus(e){},
      onConfirm(e){},
      onChanging(e){}
    } as IAPP
  } as IMixin<IFieldProps>]
}
// 多选一
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
          value: formValue
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

// 多选多
export function getFieldGroupArrayMixin(){
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
        // let {limit = Number.MAX_SAFE_INTEGER} = this.props.props
        let {value: indexValue} = e.detail
        if(!Array.isArray(indexValue)){
          return console.error(`[value change error]: 非数组值`)
        }
        let values = indexValue.map((v,index) => this.data.dataSource[index].value)
        // if(values.length > limit)return my.alert({
        //   title: `最多只能选择${limit}项`
        // })
        this.props.onChange && this.props.onChange({
          value: values
        })
      }
    } as IAPP
  } as IMixin<IFieldGroupProps<Array<any>>> ]
}