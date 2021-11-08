import { sleep } from './index'

describe('sleep', () => {
  it('should be defined', () => {
    expect(sleep).toBeDefined()
  })

  it('should work', async () => {
    const start = +(new Date())
    await sleep(2000)
    const end = +(new Date())
    const duration = end - start
    expect(duration).toBeGreaterThan(1999)
  })
})
