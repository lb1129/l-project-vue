import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      message: 'tsx text 11'
    }
  },
  methods: {
    clickHandler() {
      this.message = 'tsx text clicked'
    }
  },
  render() {
    return (<div onClick={this.clickHandler}>{ this.message }</div>)
  }
})
