const env = {
    AUTH0_CONNECTIONS: [
        {
            id: process.env.AUTH0_CONNECTIONS_0_ID,
            name: process.env.AUTH0_CONNECTIONS_0_NAME,
            tenant: process.env.AUTH0_CONNECTIONS_TENANT,
        },
        {
            id: process.env.AUTH0_CONNECTIONS_1_ID,
            name: process.env.AUTH0_CONNECTIONS_1_NAME,
            tenant: process.env.AUTH0_CONNECTIONS_TENANT,
        },
    ]
}

module.exports = {
    env,
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
            fs: 'empty',
            net :'empty',
            tls: 'empty',
        }
      }
  
      return config
    }
  }