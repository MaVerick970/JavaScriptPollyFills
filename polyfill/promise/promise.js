const STATES = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILURE: "failure",
};

class MyPromise {
  #value;
  #state = STATES.PENDING;
  #thenCb = [];
  #catchCb = [];

  constructor(cb) {
    try {
      cb(this.#onSuccess, this.#onFail);
    } catch (error) {
      this.#onFail(error);
    }
  }

  #runCallbacks() {
    if (this.#state === "success") {
      this.#thenCb.forEach((cb) => cb(this.#value));
      this.#thenCb = [];
    }
    if (this.#state === "failure") {
      this.#catchCb.forEach((cb) => cb(this.#value));
      this.#catchCb = [];
    }
  }

  #onFail(value) {
    if (this.#state !== "pending") return;
    this.#state = STATES.FAILURE;
    this.#value = value;
    this.#runCallbacks();
  }

  #onSuccess(value) {
    if (this.#state !== "pending") return;

    if (typeof value === MyPromise) {
      value.then(this.#onSuccess, this.#onFail);
    }

    this.#state = STATES.SUCCESS;
    this.#value = value;
    this.#runCallbacks();
  }

  then(thenCb, catchCb) {
    return new MyPromise((resolve, reject) => {
      this.#thenCb.push((value) => {
        if (!thenCb) {
          resolve(value);
          return;
        }
        try {
          resolve(thenCb(value));
        } catch (error) {
          reject(error);
        }
      });

      this.#catchCb.push((value) => {
        if (!catchCb) {
          reject(value);
          return;
        }
        try {
          resolve(catchCb(value));
        } catch (error) {
          reject(error);
        }
      });

      this.#runCallbacks();
    });
  }

  catch(cb) {
    this.then(null, cb);
  }

  finally(cb) {
    return this.then(
      (result) => {
        cb();
        return result;
      },
      (result) => {
        cb();
        throw result;
      }
    );
  }
}

// assume the promise has not resolved
//   let p = new Promise(...);
//   p.then(...)
//   p.then(...)
//   p.then(...)
//   p.then(...)
//   assume the promise has resolved at this point of time
//   the thenCallbacks will run because the runCallbacks check the state
//   Promise has resolved
//   p.then()  in this case this will run immediately because promise is resolved

// we also have another case of Promise where the thenable has successCB and rejectCb
// x.then(()=>{} , ()=>{})
// the first CB is a successCB and the secondCB is the rejectCB
// the rejectCB is like this catch((error)=> { return error})
// when you return something from the error callback then it can be accessed in the thenCb
