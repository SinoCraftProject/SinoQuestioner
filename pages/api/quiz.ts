import {NextApiRequest, NextApiResponse} from "next";
import database from "./_db";
import {QuizAnswer, QuizModel, QuizQuestion} from "../../models/QuizModel";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        res.status(401);
    } else {
        res.status(200).json(await getQuizzes());
    }
}

async function getQuizzes(): Promise<QuizModel> {
    let db = await (await database).db();
    let collection = await db.collection("quiz");

    let questions: QuizQuestion[] = [];

    let res = await collection.find().toArray();

    for (let q of res) {
        console.log(q)

        let answers: QuizAnswer[] = [];

        if (q.question
            && q.answerA && q.answerB
            && q.answerC && q.answerD
            && q.correctMark) {
        }
        else {
            continue;
        }

        let correct: string = q.correctMark;

        // Todo: qyl27: there is only 4 answers.
        answers.push({
            answer: q.answerA,
            answerMark: "A",
            isCorrect: correct.toUpperCase() == "A".toUpperCase()
        });

        answers.push({
            answer: q.answerB,
            answerMark: "B",
            isCorrect: correct.toUpperCase() == "B".toUpperCase()
        });

        answers.push({
            answer: q.answerC,
            answerMark: "C",
            isCorrect: correct.toUpperCase() == "C".toUpperCase()
        });

        answers.push({
            answer: q.answerD,
            answerMark: "D",
            isCorrect: correct.toUpperCase() == "D".toUpperCase()
        });

        let question: QuizQuestion = {
            question: q.question,
            answers: answers,
            answersCount: 4     // Todo: qyl27: we have 4 answers for now.
        }

        questions.push(question);
    }

    return {
        date: new Date(),
        questions: questions
    };
}
