import c from "../../STIAC-common/constants";
import {hgetallAsync, hsetAsync, redisClient, saddAsync, smembersAsync} from "./db";
import {uuid} from "uuidv4";
import {Ticker} from "../../STIAC-common/models/models";

export async function getOrCreateUser(userId) {
    let user = await hgetallAsync(c.storage.keys.USERS(userId));
    if (!user) {
        user = { id: userId };
        await hsetAsync(c.storage.keys.USERS(userId), Object.entries(user).flat());
    }
    return user;
}

export async function getUserLists(userId) {
    let userLists = await smembersAsync(c.storage.keys.USERS_LISTS(userId));
    if (!userLists || userLists.length === 0) {
        const list = {
            id: uuid(),
            displayName: "My list",
            ownerId: userId,
        };
        await hsetAsync(c.storage.keys.LISTS(list.id), Object.entries(list).flat());
        await saddAsync(c.storage.keys.USERS_LISTS(userId), list.id);
        userLists = [list.id];
    }
    let batch = redisClient.batch();
    for (let lid of userLists) {
        batch.hgetall(c.storage.keys.LISTS(lid));
    }
    const prom = new Promise((resolve, reject) => {
        batch.exec((err, replies) => {
            if (err) {
                reject(err);
            } else {
                resolve(replies);
            }
        });
    });

    const lists = (await prom) as any[];
    return lists.reduce((acc: any, list: any) => {
        acc[list.id.toString()] = list;
        return acc;
    }, {});
}

export async function getUserTickers(userId) {
    let tickerIds = await smembersAsync(c.storage.keys.USERS_TICKERS(userId));
    console.log("tickerIds", tickerIds);
    if (tickerIds) {
        const batch = redisClient.batch();
        for (let tid of tickerIds) {
            batch.hgetall(c.storage.keys.TICKERS(tid));
        }
        const prom = new Promise((resolve, reject) => {
            batch.exec((err, replies) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(replies);
                }
            });
        });
        const tickers = (await prom) as Ticker[];
        return tickers.reduce((acc: any, ticker: Ticker) => {
            acc[ticker.isin.toString()] = ticker;
            return acc;
        }, {});
    }
}