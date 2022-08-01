export type LeaderboardDatabaseModel = {
    timeSpan: TimeSpan;
    timeUsed: number;   // qyl27: Unit is seconds.
    player: PlayerData;
    triedTimes: number;
}

export type LeaderboardModel = {
    leaderboard: PlayerRankModel[]; // Todo: qyl27: we return top 10 records only.
}

export type PlayerRankModel = {
    rank: number;
    player: PlayerData;
    timeUsed: number;
    triedTimes: number;
}

export type LeaderboardPostModel = {
    quizKey: string,
    timeSpan: TimeSpan,
    player: PlayerData
}

export type TimeSpan = {
    start: number,
    end: number
}

export type PlayerData = {
    id: string,
    uuid: string,
}
