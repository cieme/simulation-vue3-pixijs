import { debounce, throttle } from 'lodash-es'

export const debounceForSubmit = (fn: (...args: unknown[]) => void, wait: number = 300) => {
  return debounce(fn, wait, {
    leading: true,
    trailing: false,
  })
}

export const throttleForResize = (fn: (...args: unknown[]) => void, wait: number = 60) => {
  return throttle(fn, wait, {
    leading: false,
    trailing: true,
  })
}
