import { MongoClient, Db, Collection } from 'mongodb'
import { loggerService } from './logger'

export const dbService = {
	getCollection
}

var dbConn: Db | null = null

async function getCollection(collectionName: string) {
	try {
		const db = await _connect()
		const collection = await db.collection(collectionName)
		return collection
	} catch (err) {
		loggerService.error('Failed to get Mongo collection', err)
		throw err
	}
}

async function _connect() {
	if (dbConn) return dbConn
	try {
		const uri = process.env.MONGODB_URI
		if (!uri) {
			throw new Error('MONGODB_URI is not defined')
		}

		const dbName = process.env.DB_NAME
		if (!dbName) {
			throw new Error('DB_NAME is not defined')
		}

		const client = await MongoClient.connect(uri)
		const db = client.db(dbName)
		dbConn = db
		return db
	} catch (err) {
		loggerService.error('Cannot Connect to DB', err)
		throw err
	}
}
