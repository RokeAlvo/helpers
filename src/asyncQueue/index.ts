import { rejectAfter } from '../rejectAfter'

type TaskState = 'finished' | 'pending' | 'inWork'

type Task<WA, WR> = {
    workerArgs: WA,
    state: TaskState
    result: WR | null
    error: Error | null
}

type Result<WR> = {
    result: WR | null,
    error: Error | null
}

export class AsyncQueue<WorkerArgs, WorkerResult> {
  constructor (
      private readonly workers: ((args: WorkerArgs) => Promise<WorkerResult>)[],
      private readonly argsList: WorkerArgs[],
      private readonly timout?: number
  ) {
    this.createQueue()
  }

  private queue: Task<WorkerArgs, WorkerResult>[] = []

  public async start (): Promise<Result<WorkerResult>[]> {
    await Promise.all(
      this.workers.map((worker) => this.execute(worker))
    )
    return this.getResults()
  }

  private async execute (worker: ((args: WorkerArgs) => Promise<WorkerResult>)) {
    const task = this.getNextTask()
    if (task === undefined) return
    task.state = 'inWork'
    try {
      let result
      if (this.timout) {
        result = await Promise.race([
          rejectAfter(this.timout, 'timout'),
          worker(task.workerArgs)
        ])
      } else {
        result = await worker(task.workerArgs)
      }
      task.result = result as unknown as WorkerResult
    } catch (e) {
      task.error = e as Error
    } finally {
      task.state = 'finished'
    }
    await this.execute(worker)
  }

  private createQueue () {
    this.queue = this.argsList.map(args => ({
      workerArgs: args,
      state: 'pending',
      result: null,
      error: null
    }))
  }

  private getNextTask () {
    return this.queue.find(task => task.state === 'pending')
  }

  private getResults (): Result<WorkerResult>[] {
    return this.queue.map(task => ({
      result: task.result,
      error: task.error
    }))
  }
}
