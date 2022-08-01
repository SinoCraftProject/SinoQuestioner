import {NextApiRequest, NextApiResponse} from "next";
import {
    LeaderboardDatabaseModel,
    LeaderboardModel,
    LeaderboardPostModel,
    PlayerData,
    PlayerRankModel,
    TimeSpan
} from "../../../models/LeaderboardModel";
import database from "../_db";
import {number} from "prop-types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let { quizId, best } = req.query;

    if (quizId !== process.env.QUIZ_ID) {
        res.status(404);
        return;
    }

    if (req.method === 'GET') {
        await doGetLeaderboard(req.query.player, res, best);
        return;
    }

    if (req.method === 'POST') {
        let data: LeaderboardPostModel = req.body;

        let key = data.quizKey;
        if (key !== process.env.LEADERBOARD_KEY) {
            res.status(403);
            return;
        }

        if (!data.player.id || !data.player.uuid || !data.timeSpan.start || !data.timeSpan.end) {
            res.status(403);
            return;
        }

        await doPostLeaderboard(data, res);
        return;
    }

    res.status(404);
    return;
}

const aggWithBest = [
    {
        '$sort': {
            'timeUsed': 1,
            'triedTimes': 1
        }
    }, {
        '$group': {
            '_id': '$player',
            'records': {
                '$first': {
                    '_id': '$_id',
                    'player': '$player',
                    'timeUsed': '$timeUsed',
                    'timeSpan': '$timeSpan',
                    'triedTimes': '$triedTimes'
                }
            }
        }
    }, {
        '$sort': {
            'records.timeUsed': 1,
            'records.triedTimes': 1
        }
    }, {
        '$limit': 10
    }
];

async function doGetLeaderboard(player: any, res: NextApiResponse, best: any) {
    let db = await (await database).db();
    let collection = await db.collection('leaderboard');

    if (player) {
        let playerId = player + '';
        let result = await collection.aggregate([
            { '$match': { 'player.id': playerId }},
            aggWithBest
        ]).toArray();

        let data = result.records;
        // if (best == true) {
        //     for (let i = 1; i < result.records.length; i++) {
        //         if (result.records[i].timeUsed < data.timeUsed) {
        //             data = result.records[i];
        //         }
        //     }
        // }

        let rank: PlayerRankModel = {
            rank: -1,   // qyl27: not supported now.
            player: data.player,
            timeUsed: data.timeUsed,
            triedTimes: data.triedTimes,
        };

        res.status(200).json(rank);
    } else {
        let result = await collection.aggregate(aggWithBest).toArray();

        let ranks = [];
        for (let i = 0; i < result.length; i++) {
            let data = result[i].records;
            let rank: PlayerRankModel = {
                rank: i + 1,
                player: data.player,
                timeUsed: data.timeUsed,
                triedTimes: data.triedTimes
            };

            ranks.push(rank);
        }

        res.status(200).json({leaderboard: ranks});
        return;
    }
}

async function doPostLeaderboard(data: LeaderboardPostModel, res: NextApiResponse) {
    let rank = await insertAndResort(data.timeSpan, data.player);
    res.status(200).json({rank: rank});
}

async function insertAndResort(time: TimeSpan, player: PlayerData) {
    let db = await (await database).db();
    let collection = await db.collection('leaderboard');

    let triedTimes = 0;
    let playerRecords = await collection.find({player: player}).toArray();
    if (playerRecords.length !== 0) {
        triedTimes += playerRecords.length;
    }

    let timeUsed = time.end - time.start;

    let model: LeaderboardDatabaseModel = {
        timeSpan: time,
        timeUsed: timeUsed,
        player: player,
        triedTimes: triedTimes + 1
    };

    await collection.insertOne(model);
}
