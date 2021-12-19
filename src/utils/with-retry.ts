import { GitError } from 'simple-git'
import { retryUntil, anyOf, maxRetries, delay, IContext } from 'extra-retry'

export async function withRetry(fn: () => void): Promise<void> {
  await retryUntil(
    anyOf(
      retryOnNetworkError
    , maxRetries(3)
    , delay(1000)
    )
  , fn
  )
}

function retryOnNetworkError(ctx: IContext): boolean {
  if (ctx.error instanceof GitError) {
    if (ctx.error.message.includes('Connection closed')) {
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}
