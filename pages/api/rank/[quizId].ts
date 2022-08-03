import {NextApiRequest, NextApiResponse} from "next";
import {
    BestModel,
    PlayerData, Rank,
    RankBoardModel,
    RankDataModel,
    RankRecordDataModel,
    RankReqModel,
    TimeSpan
} from "../../../models/RankModel";
import database from "../_db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let { quizId, best, player } = req.query;

    if (quizId !== process.env.QUIZ_ID) {
        res.status(404);
        return;
    }

    if (req.method === 'GET') {
        if (best == 'true') {
            await makeBestRank(res, player + '');
        } else {
            await makeRank(res);
        }
        return;
    }

    if (req.method === 'POST') {
        let data: RankReqModel = req.body;

        let key = data.key;
        if (key !== process.env.RANK_KEY) {
            res.status(403);
            return;
        }

        if (!data.player.id || !data.player.uuid || !data.time.start || !data.time.end) {
            res.status(403);
            return;
        }

        await record(res, data.player, data.time, data.successful);
        return;
    }

    res.status(404);
    return;
}

async function record(res: NextApiResponse, playerData: PlayerData, time: TimeSpan, isSuccessful: boolean) {
    let db = await (await database).db();
    let rank = await db.collection('rank');
    let record = await db.collection('rankRecord');

    let player: RankDataModel = await rank.findOne<RankDataModel>({player: playerData});

    let best = false;

    let recordModel: RankRecordDataModel = {
        time: parseInt((+new Date() / 1000).toString()),
        player: playerData,
        span: time
    }

    await record.insertOne(recordModel);

    if (player) {
        await rank.updateOne({ player: player },
            { $set: { 'tries': (player.tries + 1), 'bestTries': (player.bestTries + 1) }});
        if (isSuccessful) {
            let timeUsed = time.end - time.start;
            if (timeUsed < player.best) {
                best = true;
                await rank.updateOne({ player: player }, { $set: { 'best': timeUsed }});
            }
        }
    } else {
        let timeUsed = time.end - time.start;
        let model: RankDataModel = {
            player: playerData,
            tries: 0,
            best: timeUsed,
            bestTries: 0
        };

        await rank.insertOne(model);
        best = true;
    }

    res.status(200).json({best: best});
    return;
}

async function makeRank(res: NextApiResponse, ) {
    let db = await (await database).db();
    let collection = await db.collection('rank');

    let ranks = [];
    let data = await collection.find()
        .sort({tries: 1})
        .sort({timeUsed: 1})
        .limit(10)
        .toArray();

    for (let i = 1; i <= data.length; i++) {
        let rank: Rank = {
            rank: i,
            player: data[i - 1].player,
            timeUsed: data[i - 1].best,
            tries: data[i - 1].tries
        };

        ranks.push(rank);
    }

    let board: RankBoardModel = {
        date: parseInt((+new Date() / 1000).toString()),
        ranks: ranks
    }

    res.status(200).json(board);
    return;
}

async function makeBestRank(res: NextApiResponse, player: string) {
    let db = await (await database).db();
    let collection = await db.collection('rank');

    if (!player) {
        let ranks = [];

        let data = await collection.find()
            .sort({best: 1})
            .limit(10)
            .toArray();

        for (let i = 1; i <= data.length; i++) {
            let rank: Rank = {
                rank: i,
                player: data[i - 1].player,
                timeUsed: data[i - 1].best,
                tries: data[i - 1].tries
            };

            ranks.push(rank);
        }

        let board: RankBoardModel = {
            date: parseInt((+new Date() / 1000).toString()),
            ranks: ranks
        }

        res.status(200).json(board);
        return;
    } else {
        let data: RankDataModel = await collection.findOne<RankDataModel>({ player: { id: player }});

        let rank: BestModel = {
            player: data.player,
            best: data.best
        };

        res.status(200).json(rank);
        return;
    }
}
