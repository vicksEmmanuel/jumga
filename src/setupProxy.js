const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    'admin/auth/signin',
    createProxyMiddleware({
      target: 'http://localhost:5000/',
      secure: false,
      changeOrigin: true,
    })
  );
  app.use(
    'admin/controls/create/team',
    createProxyMiddleware({
      target: 'http://localhost:5000/',
      secure: false,
      changeOrigin: true,
    })
  );
  app.use(
    'team/sport/',
    createProxyMiddleware({
      target: 'http://localhost:5000/',
      secure: false,
      changeOrigin: false,
    })
  );
  app.use(
    'sport/competition/',
    createProxyMiddleware({
      target: 'http://localhost:5000/',
      secure: false,
      changeOrigin: false,
    })
  );
  app.use(
    'competition/',
    createProxyMiddleware({
      target: 'http://localhost:5000/',
      secure: false,
      changeOrigin: false,
    })
  );
};