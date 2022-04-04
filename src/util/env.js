let env = {}

env.wsHost = 'ws://127.0.0.1:9080'

if (process.env.NODE_ENV !== 'development') {
  env.wsHost = 'wss://kangyonggan.com'
}

export default env


