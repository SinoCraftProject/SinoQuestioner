export type RankReqModel = {
    key: string;
    time: TimeSpan;
    player: PlayerData;
    successful: boolean;
}

export type RankDataModel = {
    player: PlayerData;
    tries: number;
    best: number;
    bestTries: number;
}

export type RankRecordDataModel = {
    span: TimeSpan;
    player: PlayerData;
    time: number;
}

export type RankBoardModel = {
    ranks: Rank[];
    date: number;
}

export type BestRanksModel = {
    ranks: BestModel[];
    date: number;
}

export type Rank = {
    rank: number;
    player: PlayerData;
    tries: number;
    timeUsed: number;
}

export type BestModel = {
    best: number;
    player: PlayerData;
}

export type TimeSpan = {
    start: number,
    end: number
}

export type PlayerData = {
    id: string,
    uuid: string,
}
