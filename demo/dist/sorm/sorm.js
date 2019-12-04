import { getFormMixins } from '../Core/Form';
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
Component({
  mixins: getFormMixins(),
  data: {
    formCore: {},
    supported: Supported
  },
  props: {},
  didMount: function didMount() {},
  didUpdate: function didUpdate() {},
  didUnmount: function didUnmount() {},
  methods: {
    onChange: function onChange(e) {
      console.log(e);
    }
  }
});