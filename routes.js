module.exports = (defineRoutes) => {
	
	// These are placeholder routes that may or may not exist in the end
	return defineRoutes((route) => {
		// Index
		route('/', 'routing/index.tsx')
		
		// Auth
		route('/login', 'auth/login.tsx')
		
		// User
		route('/user/:id', 'user/profile.tsx')
		
		// Content
		route('/sketchbook/:id', 'content/sketchbook.tsx')
		route('/sketchbook/:id/:entry', 'content/entry.tsx')
		route('/seminar/:id', 'content/seminar.tsx')
	})
}