import { getBrowserInstance } from './get-browser.js'

const browser = getBrowserInstance()

export async function evalOnPage <R, T = R> (src: string, transform: (arg: R) => T = (o: any) => o): Promise<T> {
  const deferred = Promise.withResolvers<T>()

  // test to make sure @libp2p/devtools-metrics is present on the page
  browser.devtools.inspectedWindow.eval<R>(src, (result, isExecption) => {
    if (isExecption) {
      console.error('could not eval', src, isExecption)
      deferred.reject(new Error('Exception'))
      return
    }

    try {
      deferred.resolve(transform(result))
    } catch (err) {
      deferred.reject(err)
    }
  })

  return deferred.promise
}
