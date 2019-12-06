Component({
  mixins: [],
  data: {},
  props: {},
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    openPicker(){
      my.datePicker && my.datePicker({
        ...this.props.props,
        success: (res) => {
          my.alert({
            title: 'datePicker response: ' + JSON.stringify(res)
          });
        },
      });
    }
  },
});
