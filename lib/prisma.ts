// NOTE: The Prisma query engine can panic at runtime in some environments
// (binary mismatch, missing native dependencies, etc.). Constructing
// PrismaClient eagerly at module import time may cause the process to abort.
// To avoid that and keep the dev server running, we export `prisma` as null
// by default. If you want Prisma enabled, run `npx prisma generate` and
// replace this file to construct PrismaClient after ensuring the correct
// binaries are present.

// Provide a safe lazy initializer for Prisma. By default Prisma is disabled
// to avoid runtime panics from the query engine. To enable Prisma in your
// environment set the environment variable `ENABLE_PRISMA=true` and run
// `npx prisma generate` so the client binaries are present.

let _prisma: any = null

export function getPrisma() {
	if (_prisma) return _prisma

	const enabled = (process.env.ENABLE_PRISMA || '').toLowerCase()
	if (!(enabled === '1' || enabled === 'true')) return null

	try {
		// require here to avoid importing @prisma/client at module load time
		const { PrismaClient } = require('@prisma/client')
		_prisma = new PrismaClient()
		return _prisma
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('PrismaClient initialization failed:', err)
		_prisma = null
		return null
	}
}

export default getPrisma
