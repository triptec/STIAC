import c from "../../STIAC-common/constants";
import {
  hgetallAsync,
  hsetAsync,
  redisClient,
  saddAsync,
  smembersAsync,
} from "./db";
import { uuid } from "uuidv4";

export async function getListsTickers(listIds) {
  const batch = redisClient.batch();
  for (let lid of listIds) {
    batch.smembers(c.storage.keys.LISTS_TICKERS(lid));
  }
  const prom1 = new Promise((resolve, reject) => {
    batch.exec((err, replies) => {
      if (err) {
        reject(err);
      } else {
        resolve(replies);
      }
    });
  });

  const listsTickers = (await prom1) as any[];
  return listsTickers.reduce((acc: any, list: any, index: number) => {
    acc[listIds[index]] = new Set(list);
    return acc;
  }, {});
}

export async function createList(list_, userId) {
  const list = {
    ...list_,
    id: uuid(),
    owner: userId,
  };
  await hsetAsync(c.storage.keys.LISTS(list.id), Object.entries(list).flat());
  await saddAsync(c.storage.keys.USERS_LISTS(userId), list.id);
  return list;
}
