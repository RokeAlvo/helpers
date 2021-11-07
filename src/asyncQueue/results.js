const results = [
    {
        "workerId": 1,
        "taskId": 1,
        "start": 1,
        "end": 55
    },
    {
        "workerId": 2,
        "taskId": 2,
        "start": 1,
        "end": 63
    },
    {
        "workerId": 3,
        "taskId": 3,
        "start": 1,
        "end": 203
    },
    {
        "workerId": 1,
        "taskId": 4,
        "start": 55,
        "end": 90
    },
    {
        "workerId": 2,
        "taskId": 5,
        "start": 63,
        "end": 129
    },
    {
        "workerId": 1,
        "taskId": 6,
        "start": 90,
        "end": 195
    },
    {
        "workerId": 2,
        "taskId": 7,
        "start": 129,
        "end": 234
    },
    {
        "workerId": 1,
        "taskId": 8,
        "start": 195,
        "end": 298
    },
    {
        "workerId": 3,
        "taskId": 9,
        "start": 203,
        "end": 256
    },
    {
        "workerId": 2,
        "taskId": 10,
        "start": 234,
        "end": 289
    },
    {
        "workerId": 3,
        "taskId": 11,
        "start": 256,
        "end": 309
    }
]

const byWorker = {1: [], 2: [], 3: []}
for(const result of results) {
    byWorker[result.workerId].push(result)
}
console.dir(byWorker, {depth: null})
