import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient({log: ['query', 'info', 'warn', 'error'],})

export async function getOrCreateUserByInstallationId(installationId) {
    let user = await prisma.user.findUnique({
        where: {
            installationId: installationId,
        },
    })
    if (!user) {
        user = await prisma.user.create({
            data: {
                installationId: installationId,
            },
        })
    }
    return user;
}


export async function getUserLists(userId) {
    let lists = await prisma.list.findMany({
        where: {
            users: {
                some: {
                    id: userId
                }
            },
        },
        include: {
            tickers: true,
            tickersMeta: true,
        }
    }) as any[];
    if (!lists || lists.length === 0) {
        const list = await prisma.list.create({
            data: {
                displayName: 'My list',
                description: 'Default list',
                ownerId: userId,
            },
        })
        lists = [list];
    }

    return lists.reduce((acc: any, list: any) => {
        acc[list.id.toString()] = list;
        return acc;
    }, {});
}

export async function getUserTickers(userId) {
    const result = await prisma.$queryRaw(`
SELECT Ticker.* from Ticker
LEFT JOIN _ListToUser ltu on ltu.B=${userId} 
LEFT JOIN _ListToTicker ltt on ltt.A=ltu.A
WHERE Ticker.id=ltt.B
`);

    return result.reduce((acc: any, ticker: any) => {
        acc[ticker.id.toString()] = ticker;
        return acc;
    }, {});
}
