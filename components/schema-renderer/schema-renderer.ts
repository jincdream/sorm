import {
  getFormMixins
} from '../Core/Form'
declare var console: any;

Component({
  mixins: getFormMixins(),
  data: {
    formCore:{},
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
