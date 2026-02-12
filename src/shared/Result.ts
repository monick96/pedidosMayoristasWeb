/**
 * Estructura para representar el éxito y el error de forma tipada.
 */
export type Result<T, E = Error> = Success<T, E> | Failure<T, E>;

export class Success<T, E> {
  readonly value: T;
  constructor(value: T) {
    this.value = value;
  }
  isOk(): this is Success<T, E> {
    return true;
  }
  isFail(): this is Failure<T, E> {
    return false;
  }
}

export class Failure<T, E> {
  readonly error: E;
  constructor(error: E) {
    this.error = error;
  }
  isOk(): this is Success<T, E> {
    return false;
  }
  isFail(): this is Failure<T, E> {
    return true;
  }
}

/**
 * Helpers para instanciar resultados rápidamente
 */

export const ok = <T>(value: T): Result<T> =>
  new Success<T, Error>(value);

export const fail = <T>(error: Error): Result<T> =>
  new Failure<T, Error>(error);