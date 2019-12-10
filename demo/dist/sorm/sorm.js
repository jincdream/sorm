import { getFormMixins } from '../Core/Form';
Component({
  mixins: getFormMixins(),
  data: {
    formCore: {}
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