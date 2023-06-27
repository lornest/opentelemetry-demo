function delay(value, time) {
  return new Promise(resolve => setTimeout(() => resolve(value), time*1000));
}

export { delay }