import { resolve } from 'path'
import { openSync, readSync } from 'fs'
import { expect } from 'chai'
import { imageSize, types } from '../src'

// If something other than a buffer or filepath is passed
describe('Invalid invocation', () => {
  describe('passing buffer for tiff', () => {
    const bufferSize = 2048
    const file = 'specs/images/valid/tiff/little-endian.tiff'

    it('should throw', () => {
      const buffer = Buffer.alloc(bufferSize)
      const filepath = resolve(file)
      const descriptor = openSync(filepath, 'r')
      readSync(descriptor, buffer, 0, bufferSize, 0)
      expect(() => imageSize(buffer)).to.throw(TypeError, 'Tiff doesn\'t support buffer')
    })
  })
})

describe('Callback ', () => {
  it('should be called only once', (done) => {
    const tmpError = new Error()

    const origException = process.listeners('uncaughtException').pop()
    if (origException) {
      process.removeListener('uncaughtException', origException)
    }

    process.once('uncaughtException', (err) => {
      expect(err).to.equal(tmpError)
    })

    imageSize('specs/images/valid/jpg/sample.jpg', () => {
      process.nextTick(() => done())
      throw tmpError
    })
  })
})

describe('.types property', () => {
  it('should expose supported file types', () => {
    expect(types).to.eql(['bmp', 'cur', 'dds', 'gif', 'icns', 'ico', 'j2c', 'jp2', 'jpg', 'ktx', 'png', 'pnm', 'psd', 'svg', 'tiff', 'webp'])
  })
})
