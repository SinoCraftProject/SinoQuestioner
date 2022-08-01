export type QuizModel = {
    date: Date;

    questions: QuizQuestion[];
}

export type QuizQuestion = {
    id: number;
    question: string;
    answersCount: number;
    answers: QuizAnswer[];
}

export type QuizAnswer = {
    answer: string;
    answerMark: string;
    isCorrect: boolean;
}
