export function rejectAfter (timout: number, message?: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { reject(new Error(message ?? '')) }, timout)
  })
}
