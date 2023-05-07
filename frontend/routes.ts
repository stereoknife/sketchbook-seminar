import { type DefineRoutesFunction, type DefineRouteFunction, type RouteManifest } from '@remix-run/dev/dist/config/routes'

export default function (defineRoutes: DefineRoutesFunction): RouteManifest {
  // These are placeholder routes that may or may not exist in the end
  return defineRoutes((_route: DefineRouteFunction) => {
    const route = (r: string, p: string): void => { _route(r, `routing/${p}.tsx`) }

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
