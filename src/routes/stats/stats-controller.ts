import { Context } from "hono";
import { getStatistics } from "./stats-service";

export async function getStats(c: Context) {
	const stats = await getStatistics()
	return c.json({ stats })
}