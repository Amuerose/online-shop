

export async function onRequest(context) {
  const res = await context.next();
  const req = context.request;
  const accept = req.headers.get('accept') || '';

  // If it's a GET request for an HTML page that wasn't found,
  // serve the app shell (index.html) for SPA routing
  if (res.status === 404 && req.method === 'GET' && accept.includes('text/html')) {
    const url = new URL(req.url);
    url.pathname = '/index.html';
    return context.env.ASSETS.fetch(new Request(url, req));
  }

  return res;
}