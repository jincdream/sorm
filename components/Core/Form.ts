import {
  IFormOption,
  ISchema,
  ISormComponents,
  IMixin,
  IFieldProps,
  IFormProps,
  ISchemaPareserResult
} from './Share'

// import {createForm} from '@uform/core'

class Sorm {
  constructor(){
    this.fieldComponents = {}
    this.initValue = {}
    // this.core = createForm({
    //   onChange: (values) => {

    //   },
    //   //表单提交事件回调
    //   onSubmit: (values) => {

    //   },
    //   //表单重置事件回调
    //   onReset: () => {

    //   },
    //   //表单校验失败事件回调
    //   onValidateFailed:(validated) => {

    //   }
    // })
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
      
      // this.core.registerField({
      //   name: thisKey,
      //   initialValue: cprops.value,
      //   value: cprops.value,
      //   rules: rules
      // })

      return {
        component: {
          name: cname.toLocaleLowerCase(),
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
        self.setData({
          uiValue: e.detail.value
        })
      },
      onBlur(e){},
      onFocus(e){},
      onConfirm(e){}
    }
  } as IMixin<IFieldProps>]
}