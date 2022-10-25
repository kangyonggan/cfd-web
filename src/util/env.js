let env = {}

env.wsHost = 'ws://127.0.0.1:9080'

if (process.env.NODE_ENV !== 'development') {
  env.wsHost = 'ws://192.168.3.179:9080'
}

export default env



