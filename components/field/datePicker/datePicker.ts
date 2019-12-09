enum Format {
  YMD    = "yyyy-MM-dd",
  HM     = "HH:mm",
  YMD_HM = "yyyy-MM-dd HH:mm",
  YM     = "yyyy-MM",
  Y      = "yyyy"
}
enum ValueType {
  Format = "format",
  Timestamp = "timestamp"
}
interface IDatePickerProps {
  format?: Format,
  currentDate?: string,
  startDate?: string,
  endDate?: string,
  valueType?: ValueType
}

const DateFormat = function(format: Format = Format.YMD, timestamp: number):string{
  let date    = new Date(timestamp)
  let year    = date.getFullYear()
  let month   = date.getMonth() + 1
  let day     = date.getDate()
  let hours   = date.getHours()
  let minutes = date.getMinutes()

  return format
          .replace("yyyy",year.toString())
          .replace("MM",month.toString())
          .replace("dd",day.toString())
          .replace("HH",hours.toString())
          .replace("mm",minutes.toString())
}

const GetDateValue = function(value: string , props: IDatePickerProps):number | string{
  let {valueType,format} = props
  // format to timestamp
  if(valueType === ValueType.Timestamp && format !== Format.HM){
    let date = new Date(0)
    let [ymd, hm="00:00"] = value.split(' ')
    let [year, month = 1, day = 1] = ymd.split('-')
    let [hours,minutes] = hm.split(":")
    date.setFullYear(+year)
    date.setMonth(+month - 1)
    date.setDate(+day)
    date.setHours(+hours)
    date.setMinutes(+minutes)
    return +date
  }
  return value
}

Component({
  mixins: [],
  data: {},
  props: {},
  didMount() {
    let {props} = this.props
    let {valueType,value} = props
    let labelValue = value
    
    if(value && !isNaN(+value) &&  valueType === ValueType.Timestamp){
      labelValue = DateFormat(props.format,+value)
    }
    this.setData({
      labelValue,
      value: labelValue
    })
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    openPicker(){
      let {labelValue} = this.data
      let {props = {},onChange} = this.props
      props.format = props.format || Format.YMD
      if(labelValue){
        props.currentDate = labelValue
      }else if(!props.currentDate){
        props.currentDate = DateFormat(props.format,Date.now())
      }
      my.datePicker && my.datePicker({
        ...props,
        success: (res) => {
          
          let {date} = res
          let value = GetDateValue(date,props)
          this.setData({
            value,
            labelValue: date
          })
          onChange && onChange({
            value
          })
          
        },
        fail: (res)=>{},
        complete: (res)=>{}
      });
    }
  },
});
