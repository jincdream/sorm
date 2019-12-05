import { getFieldMixins } from '../Core/Form';
Component({
  mixins: getFieldMixins(),
  data: {},
  props: {},
  didMount: function didMount() {
    console.log(this.props);
  },
  didUpdate: function didUpdate() {},
  didUnmount: function didUnmount() {},
  methods: {}
});