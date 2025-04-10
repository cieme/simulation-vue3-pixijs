import { debounce, throttle } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
export const debounceForSubmit: <T>(args: (args: T) => void, wait?: number) => (args: T) => void = (
  fn,
  wait = 60,
) => {
  return debounce(fn, wait, {
    leading: true,
    trailing: false,
  })
}

export const throttleForResize: <T>(args: (args: T) => void, wait?: number) => (args: T) => void = (
  fn,
  wait = 60,
) => {
  return throttle(fn, wait, {
    leading: false,
    trailing: true,
  })
}

export const uuid = () => {
  return uuidv4()
}
