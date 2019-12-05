export enum NativeFormItemName {
  input = "input",
  textarea = "textarea",
  radio = "radio",
  radioGroup = "radio-group",
  checkbox = "checkbox",
  checkboxGroup = "checkboxGroup",
  switch = "switch",
  slider = "slider",
  pickerView = "pickerView",
  picker = "picker",
}

export interface ISupportedFormItem {
  input: boolean,
  textarea: boolean,
  radio: boolean,
  radioGroup: boolean,
  checkbox: boolean,
  checkboxGroup: boolean,
  switch: boolean,
  slider: boolean,
  pickerView: boolean,
  picker: boolean,
  view: boolean,
  "radio-group": boolean,
  "checkbox-group": boolean,
  "picker-view": boolean
}

enum FormType{
  Object = "object",
  Array  = "array"
}

export interface ISchema {
  /**
   * 类型涉及到数据类型，还有交互样式，
   * 如果是数组类型，则有添加、删除和排序的交互
   */
  type: FormType,
  title: string,
  description: string,
  properties: {
    [key: string]: ISchema
  },
  /**
   * FormItem 相关的props
   */
  "x-props": object,
  /**
   * 表单组件名。内置的组件在 NativeFormItemName 可以查询
   */
  "x-component": NativeFormItemName | string,
  /**
   * 表单组件的属性
   */
  "x-component-props": any,
  /**
   * 属性的表达式
   */
  "x-component-props-expression": object,
  /**
   * 验证属性
   */
  "x-rules": [object]
}
export enum IServerType {
  MTOP = "mtop",
  TOP  = "top",
  HTTP = "http"
}
export interface IMtopOption {
  api: string,
  v: string,
  data: object
}
export interface IServerDesc {
  type: IServerType,
  option: IMtopOption | object
}
export interface IServer {
  fetch?: IServerDesc,
  submit?: IServerDesc
}
export interface IFormOption{
  schema: ISchema,
  server?: IServer
}

export interface IFormItem{
  name: string,
  props: any,
  expression?: object
}

export interface ISormComponents{
  component: IFormItem,
  /**
   * label
   */
  label: string,
  /**
   * 字段名
   */
  keyName: string,
  /**
   * 值类型
   */
  formType: FormType,
  /**
   * 属性
   */
  fieldProps: object,
  hooks: [],
  listening: [],
  childrends: Array<ISormComponents>
}
interface IFormCore {

}
interface IFieldCore {
  getValue: ()=>{},
  setValue: ()=>{},
  validate: ()=>{}
}
interface IEventHandle {
  ( data: any, fieldCore: IFieldCore, formCore: IFormCore ): never
}
interface IEmmiter{
  (filedName: string, data: any): never
}
interface IListener{
  (filedName: string, callback: IEventHandle)
}
export interface ISchemaPareserResult{
  values: any,
  components: Array<ISormComponents>
}
export interface IFormProps{
  style: string,
  class: string,
  schema: ISchema
}
export interface IFieldProps{
  style: string,
  class: string,
  layout: object,
  component: IFormItem,
  fieldEmmiter: IEmmiter,
  fieldListener: IListener,
  name: string,
  value: string,
  saveRef: (ref: any)=>{}
}
export interface IMixin<T> extends IAPP{
  props?: T,
  data?: any,
  didMount?: ()=>{},
  methods?: object
}
export interface IAPP{
  setData?: (data: object)=>{},
  props?: any,
  data?: any,
  isArrayValue?: boolean
}
interface IDataSource {
  value: string,
  label: string,
  id?: number,
  isDefault?: boolean,
  color?: string
}
export interface IFieldGroupProps<T>{
  props: {
    value?: T,
    dataSource: Array<IDataSource>,
  },
  onChange: (e: any) => {}
}