Component({
  mixins: [],
  data: {},
  props: {},
  didMount() {
    console.log(this.props)
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    async submit(){
      let v = await this.props.api.getValues()
      console.log(v)
      // this.props.api.reset()
      this.props.api.submit()
    }
  },
});
