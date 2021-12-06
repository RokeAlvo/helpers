import { strTemplate } from './index'

describe('strParse', () => {
  it('shold be init', () => {
    const parse = strTemplate('/path/{pathId}/image/{imageId}')
    const result = parse({
      pathId: '333',
      imageId: '22'
    })
    expect(result).toBe('/path/333/image/22')
  })

  it('optional separator', () => {
    const parse = strTemplate('/path/%%pathId%%/image/%%imageId%%', { separator: '%%%%' })
    const result = parse({
      pathId: '333',
      imageId: '22'
    })
    expect(result).toBe('/path/333/image/22')
  })
})
