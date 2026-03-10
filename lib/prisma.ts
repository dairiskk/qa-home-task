import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
	prismaClient: PrismaClient | undefined;
};

function withDefaultSslMode(connectionString: string): string {
	try {
		const url = new URL(connectionString);

		if (!url.searchParams.has("sslmode")) {
			const sslMode = process.env.NODE_ENV === "production" ? "verify-full" : "disable";
			url.searchParams.set("sslmode", sslMode);
		}

		return url.toString();
	} catch {
		return connectionString;
	}
}

function createPrismaClient() {
	const connectionString = process.env.DATABASE_URL;

	if (!connectionString) {
		throw new Error("DATABASE_URL is not set.");
	}

	const normalizedConnectionString = withDefaultSslMode(connectionString);

	try {
		const parsed = new URL(normalizedConnectionString);
		console.info("[prisma] init", {
			nodeEnv: process.env.NODE_ENV,
			host: parsed.host,
			database: parsed.pathname.replace(/^\//, ""),
			sslmode: parsed.searchParams.get("sslmode") ?? "(unset)",
		});
	} catch {
		console.warn("[prisma] failed to parse DATABASE_URL for diagnostics");
	}

	const adapter = new PrismaPg({ connectionString: normalizedConnectionString });
	return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prismaClient = prisma;
}
