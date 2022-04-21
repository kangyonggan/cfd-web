let env = {}

env.wsHost = 'ws://192.168.0.106:9080'

if (process.env.NODE_ENV !== 'development') {
  env.wsHost = 'wss://kangyonggan.com/cfd-api'
}

export default env



