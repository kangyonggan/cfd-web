let env = {}

env.wsHost = 'ws://127.0.0.1:9080'

if (process.env.NODE_ENV !== 'development') {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  env.wsHost = `${wsProtocol}//${window.location.host}/cfd-api`
}

export default env


