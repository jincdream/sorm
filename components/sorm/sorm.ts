import {
  ISupportedFormItem
} from '../Core/Share'
import {
  getFormMixins
} from '../Core/Form'
declare var console: any;
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
  "radio-group": true,
  "checkbox-group": true,
  "picker-view": true
}


Component({
  mixins: getFormMixins(),
  data: {
    formCore:{},
    supported: Supported
  },
  props: {},
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    onChange(e){
      console.log(e)
    }
  },
});
