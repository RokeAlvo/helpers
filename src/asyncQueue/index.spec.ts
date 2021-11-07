import {sleep} from "../sleep";
import {AsyncQueue} from "./index";

type WorkerResult = { workerId: number, taskId: number, start: number, end: number }

type WorkerArgs = { duration: number, id: number }

const worker = async (id: number, startWorker: Date, args: WorkerArgs): Promise<WorkerResult> => {
    const start = +(new Date()) - (+startWorker)
    await sleep(args.duration)
    const end = +(new Date()) - (+startWorker)
    if(args.id === 3) throw new Error('some error')
    return {
        workerId: id,
        taskId: args.id,
        start,
        end
    }
}

const getWorker = (id: number, start: Date) => (args: WorkerArgs) => worker(id, start, args)

const getWorkersPull = () => [1, 2, 3].map((id) => getWorker(id, new Date()))

const executeList: WorkerArgs[] = [
    //                          start   ->  end workerId
    {duration: 50, id: 1}, //   0       ->  50      1
    {duration: 60, id: 2}, //   0       ->  60      2
    {duration: 200, id: 3}, //  0       ->  200     3
    {duration: 30, id: 4}, //   50      ->  80      1
    {duration: 60, id: 5}, //   60      ->  120     2
    {duration: 100, id: 6}, //  80      ->  180     1
    {duration: 100, id: 7}, //  120     ->  220     2
    {duration: 100, id: 8}, //  180     ->  280     1
    {duration: 50, id: 9}, //   200     ->  250     3
    {duration: 50, id: 10},//   220     ->  270     2
    {duration: 50, id: 11}, //  250     ->  300     3
]

const expectedResult = [
    {taskId: 1, workerId: 1},
    {taskId: 2, workerId: 2},
    {taskId: undefined, workerId: undefined},
    {taskId: 4, workerId: 1},
    {taskId: 5, workerId: 2},
    {taskId: 6, workerId: 1},
    {taskId: 7, workerId: 2},
    {taskId: 8, workerId: 1},
    {taskId: 9, workerId: 3},
    {taskId: 10, workerId: 2},
    {taskId: 11, workerId: 3},
]


describe('asyncQueue', () => {
    let queue: AsyncQueue<WorkerArgs, WorkerResult>

    beforeAll(() => {
        const workers = getWorkersPull()
        queue = new AsyncQueue(workers, executeList);
    })

    it('should be defined', () => {
        expect(queue).toBeDefined()
    })

    it('mock workers is fine', async () => {
        const worker = getWorkersPull()[0]
        const result = await worker(executeList[0])
        expect(result.workerId).toBe(1)
        expect(result.taskId).toBe(1)
    })


    it('should work', async () => {
        const result = await queue.start()
        const mappedResult =result.map(queueResult => ({
            taskId:(queueResult.result)?.taskId,
            workerId: (queueResult.result)?.workerId
        }))
        expect(mappedResult).toEqual(expectedResult)

        const byWorker = {1: [], 2: [], 3: []}
        for (const res of result) {
            // @ts-ignore
            byWorker[res.result?.workerId]?.push(res.result)
        }
        console.dir(byWorker, {depth: null})

    })
})
