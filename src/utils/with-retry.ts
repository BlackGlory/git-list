import { GitError } from 'simple-git'
import { retryUntil, anyOf, maxRetries, retryOn, delay, IContext } from 'extra-retry'

export async function withRetry(fn: () => void): Promise<void> {
  await retryUntil(
    anyOf(
      retryOn([GitError])
    , retryOnNetworkError
    , maxRetries(3)
    , delay(1000)
    )
  , fn
  )
}

function retryOnNetworkError(ctx: IContext): boolean {
  const error = ctx.error as typeof GitError
  return !error.toString().includes('Connection closed')
}
