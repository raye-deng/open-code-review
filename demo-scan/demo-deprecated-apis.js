/**
 * Demo file: Deprecated API Detection
 *
 * This file contains various deprecated APIs that should be detected
 * by the adaptive deprecated API database.
 */

// Node.js deprecated APIs
const buffer = new Buffer(1024); // Deprecated: Use Buffer.from() or Buffer.alloc()
const urlParsed = url.parse('https://example.com'); // Deprecated: Use new URL()

// React deprecated lifecycle methods
class MyComponent extends React.Component {
  componentWillMount() { // Deprecated: Use componentDidMount or useEffect
    console.log('Mounting...');
  }

  componentWillReceiveProps(nextProps) { // Deprecated: Use getDerivedStateFromProps or componentDidUpdate
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  getDefaultProps() { // Deprecated: Use static defaultProps
    return { value: 'default' };
  }

  render() {
    return <div>{this.props.value}</div>;
  }
}

// Vue 2 to Vue 3 migration issues
const app = new Vue({ // Vue 2 syntax - check for Vue 3 compatibility
  el: '#app',
  data: {
    message: 'Hello'
  },
  methods: {
    updateMessage() {
      this.$set(this.data, 'message', 'Updated'); // Deprecated in Vue 3
    }
  }
});

// Use of Vue.set in Vue 3 context
Vue.set(obj, 'key', value); // Deprecated: Direct assignment in Vue 3
Vue.delete(obj, 'key'); // Deprecated: Use delete operator

// Express deprecated middleware
const app = express();
app.use(express.bodyParser()); // Deprecated: Use express.json() and express.urlencoded()

// Next.js deprecated imports
import { withRouter } from 'next/router'; // Deprecated in Next.js 13+
import { AppProps } from 'next/app'; // Check for deprecations

// Flask deprecated patterns (Python equivalent in comments)
# app.run() without host/port specification
# Flask-Session using file system backend (deprecated)

// Django deprecated patterns (in comments)
# django.utils.translation.ugettext() - deprecated, use gettext()
# django.conf.urls.url() - deprecated, use re_path()
