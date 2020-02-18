Component({
  mixins: [],
  data: {},
  props: {},
  didMount() {
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    async submit(){
      let v = await this.props.api.getValues()
      // this.props.api.reset()
      this.props.api.submit()
    }
  },
});
