import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
	prismaClient: PrismaClient | undefined;
};

function withDefaultSslMode(connectionString: string): string {
	try {
		const url = new URL(connectionString);
		const useLibpqCompat = url.searchParams.get("uselibpqcompat") === "true";
		const sslMode = url.searchParams.get("sslmode");

		if (!sslMode) {
			const sslMode = process.env.NODE_ENV === "production" ? "verify-full" : "disable";
			url.searchParams.set("sslmode", sslMode);
		} else if (!useLibpqCompat && ["prefer", "require", "verify-ca"].includes(sslMode)) {
			// Keep current pg behavior explicit and silence deprecation warning.
			url.searchParams.set("sslmode", "verify-full");
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

	const adapter = new PrismaPg({ connectionString: normalizedConnectionString });
	return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prismaClient = prisma;
}
