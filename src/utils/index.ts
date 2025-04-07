import { debounce, throttle } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid';
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
export const uuid = () => {
  return uuidv4()
}
