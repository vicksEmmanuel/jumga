export const ENV = process.env.NODE_ENV;
const isStaging = (ENV.toLowerCase() === 'development')

export const configParams = {
    // appDomain: 'http://localhost:5000'
    appDomain: (isStaging) ?  process.env.REACT_APP_STAGING_APP_DOMAIN : process.env.REACT_APP_PRODUCTION_APP_DOMAIN,
}

console.log(configParams);