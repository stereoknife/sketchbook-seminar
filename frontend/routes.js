module.exports = (defineRoutes) => {
  // These are placeholder routes that may or may not exist in the end
  return defineRoutes((_route) => {
    const route = (r, p) => _route(r, `routing/${p}.tsx`)

    // Index
    route('/', 'index')

    // Auth
    route('/login', 'auth/login')

    // User
    route('/user/:id', 'user/profile')

    // Content
    route('/sketchbook/:id', 'content/sketchbook')
    route('/sketchbook/:id/:entry', 'content/entry')
    route('/seminar/:id', 'content/seminar')
  })
}
