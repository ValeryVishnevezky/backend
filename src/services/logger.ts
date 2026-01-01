import { promises as fs } from 'fs'
import { AsyncLocalStorage } from 'async_hooks'
import path from 'path'

interface Store {
	loggedinUser?: { _id: string }
}

const asyncLocalStorage = new AsyncLocalStorage<Store>()
const logsDir = path.resolve('./logs')
const logFile = path.join(logsDir, 'backend.log')

export const loggerService = {
	debug: (...args: any[]) => _writeLog('DEBUG', ...args),
	info: (...args: any[]) => _writeLog('INFO', ...args),
	warn: (...args: any[]) => _writeLog('WARN', ...args),
	error: (...args: any[]) => _writeLog('ERROR', ...args)
}


async function _writeLog(level: string, ...args: any[]) {
	const store = asyncLocalStorage.getStore()
	const userId = store?.loggedinUser?._id
	const strs = args.map(_formatArg)

	if (userId) strs.unshift(`USER_ID: ${userId}`)
	
	const line = `${_getTime()} - ${level} - ${strs.join(' | ')}\n`
	console.log(line)
	
	try {
		await fs.mkdir(logsDir, { recursive: true })
		await fs.appendFile(logFile, line)
	} catch (err) {
		console.error('Cannot write log file', err)
	}
}

function _formatArg(arg: any) {
	if (typeof arg === 'string') return arg
	if (arg instanceof Error) return arg.stack || arg.message
	try {
		return JSON.stringify(arg)
	} catch {
		return String(arg)
	}
}

function _getTime() {
	return new Date().toLocaleString('he')
}