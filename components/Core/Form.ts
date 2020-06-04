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
  IValidate,
  IExporession
} from './Share'

import {createForm, IForm, LifeCycleTypes} from '@uform/core'
import isEqual from 'lodash.isequal'

import ExpressionRun from './ExpressionRun'

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
  constructor(){}
  public init(){
    this.core = createForm({
      onChange: (values) => {
        console.log(values)
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
  private core: IForm
  private _schema: ISchema
  private parseExpressions(props: object): Array<IExporession>{
    let linkages = []
    // 花括号
    let checkBrace = /^\{\{(.*?)\}\}$/
    // root.value
    let checkRoot = /root\.value\.(\S*)/g
    Object.keys(props).forEach((target) => {
      let deps: Array<string> = []
      let expression = {}
      let value = props[target]
      if(checkBrace.test(value) && checkRoot.test(value)){
        let exp = value.replace(checkBrace,"$1")
        exp.replace(/root\.value\.([a-zA-Z]*)/g,(m,a = "")=>{
          let [name = ""] = a.split(".")
          if(deps){
            deps.push(name)
          }
        })
        if(deps.length > 0){
         linkages.push({
            exp,
            deps,
            target: target
          })
        }
        
      }
    })
    
    return linkages
  }
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
        "x-props": fieldProps,
        "x-rules": rules,
        properties: childrenSchema
      } = componentSchemaDesc
      cprops.visible = cprops.visible === void(0) ? true : cprops.visible
      let linkages = this.parseExpressions(cprops)
      let required = false
      
      let field = this.core.registerField({
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
        },
        linkages,
        required,
        hooks: [],
        listening: [],
        keyName: thisKey,
        label,
        formType,
        fieldProps,
        childrends: this.schemaParser(componentSchemaDesc,parentKey),
        getFormCore:()=>{
          return this.getCore()
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

const InitForm = function(ref: IMixin<IFormProps> ){
  let {
      schema,
      style,
      class: className,
      onSubmit
    } = ref.props
    let { sorm } = ref
    sorm.init()
    let formCore = sorm.getCore()
    let components = sorm.parse(schema)
    ref.setData({
      schema: components,
      style,
      className,
      schemaKey: Date.now().toString(32),
      useButton: !!onSubmit,
      submit: ()=>{
        ref.submit()
      },
      reset: ()=>{
        ref.reset()
      },
      getValues: async ()=>{
        return new Promise((resolve,reject)=>{
          sorm.getCore().getFormState((state)=>{
            resolve(state.values)
          })
        })
      }
    })
}

export function getFormMixins(){
  let sorm = new Sorm()
  return [{
    didMount(){
      this.init = true
      this.sorm = sorm
      InitForm(this)
    },
    didUpdate(props: IFormOption){
      if(this.init){
        this.init = false
        return
      }
      InitForm(this)
      this.init = true
    },
    methods: {
      reset(){
        InitForm(this)
        this.init = true
      },
      submit(){
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
  let res
  try{
    res = await validate()
    
  } catch (error) {
    console.error(error)
    res = error
  }
  let { errors = [] } = res
  let errData = errors[0] || {messages:[]}
  let isError = res.errors.length > 0
  return {
    isError,
    errors: errData.messages
  }
  
}

const runCondition = function(condition: string, value: object): any{
  return ExpressionRun(condition, {root:{value}})
}

export function getFieldMixins(){
  return [{
    async didMount(){
      let {
        component,
        getFormCore,
        keyName,
        linkages
      } = this.props
      let core = getFormCore()

      let updateProps = async (depsName?: string): Promise<{[key:string]: any}>=>{
        return new Promise((resolve,reject)=>{
          if(linkages.length > 0){
            let state
            core.getFormState(({values})=>{
              linkages
                .filter(v => depsName ? v.deps.indexOf(depsName) > -1 : true)
                .map(exporession => {
                  let result = runCondition(exporession.exp, values)
                  if(!state)state = {}
                  state["cprops." + exporession.target] = result
                })
              // this.setData(state)
              state && resolve(state)
            })
          }else{
            reject(false)
          }
        })
        
      }

      core.subscribe(({
        type,
        payload
      })=>{

        switch(type){
          // 验证失败
          case CustomEventName.ValidatedError:
          console.log(payload,"path")

            {
              let [{path = "",messages = []} = {}] = (payload || []).filter(v => v.path === keyName)
              if(path){
                this.setData({
                  isError: true,
                  errors: messages,
                })
              }
            }
            break;
          // 值重设
          case CustomEventName.SromRest:
            {
              let uiValue = (payload || {})[keyName] || ""
              this.setData({
                isError: false,
                errors: [],
                uiValue,
                fieldKey: keyName + Date.now()
              })
            }
            break;
          case LifeCycleTypes.ON_FORM_CHANGE:
          {
            let name = ((payload || {}).state || {}).name
            updateProps(name).then(state=>{
              this.setData({
                ...state,
                fieldKey: keyName + Date.now()
              })
            }).catch(()=>{})
          } 
            break;
          default:
            break;
        }
      })
      let cprops = {}
      try{
        cprops = await updateProps()
      }catch(e){}
      this.setData({
        uiValue: component.props.value,
        fieldKey: keyName + Date.now(),
        cname: component.name,
        cprops: component.props,
        ...cprops
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