import { describe, expect, it } from 'bun:test'
import app from '..'

// signup
describe('signup user', () => {
	it('should signup a user', async () => {
		const req = new Request('http://localhost:3000/auth/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: 'test',
				password: 'test',
				fullname: 'testtest',
				email: 'test@test.com'
			})
		})
		const res = await app.fetch(req)
		const json = await res.json()
		expect(res.status).toBe(200)
		expect(json).toEqual({
			user: {
				_id: expect.any(String),
				username: 'test',
				fullname: 'testtest',
				email: 'test@test.com',
				isAdmin: false
			}
		})
		const cookies = res.headers.get('set-cookie')
		expect(cookies).toMatch('loginToken=')
	})
})

// login
describe('login user', () => {
	it('should login a user', async () => {
		const req = new Request('http://localhost:3000/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: 'test@test.com',
				password: 'test'
			})
		})
		const res = await app.fetch(req)
		const json = await res.json()
		expect(res.status).toBe(200)
		expect(json).toEqual({
			user: {
				_id: expect.any(String),
				username: 'test',
				fullname: 'testtest',
				email: 'test@test.com',
				isAdmin: false
			}
		})
		const cookies = res.headers.get('set-cookie')
		expect(cookies).toMatch('loginToken=')
	})
})

// logout
describe('logout user', () => {
	it('should logout a user', async () => {
		const req = new Request('http://localhost:3000/auth/logout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		})
		const res = await app.fetch(req)
		const json = await res.json()
		expect(res.status).toBe(200)
		expect(json).toEqual({
			message: 'Logged out successfully'
		})
		const cookies = res.headers.get('Set-Cookie')
		expect(cookies).toMatch('loginToken=;')
	})
})
