import { jest } from '@jest/globals';
import { ConsoleProxy } from '../src/client';

const wsUrl = `ws://localhost:8080`;
const ProxyClass = new ConsoleProxy(wsUrl);
let leProcess;
let consoleProxy;

beforeAll((done) => {
  setTimeout(() => {
    if ( ProxyClass.ws.readyState === 1 ) {
      consoleProxy = ProxyClass.proxy;
      done();
    }
  }, 1000);
});

afterAll(() => {

});

test(`testing some sh!t`, () => {
  expect(ProxyClass).toBeTruthy();
  expect(consoleProxy).toBeTruthy();
});

describe('Mock `console` methods', () => {
  const message = 'testing log';
  let spy;
  let methods = ['log', 'warn', 'error'];

  // NOTE: You will see warn, error logs on the test even though the tests passed.
  // Its expected as it's unintentionally running Node's `console`.

  beforeEach(() => {
    spy = jest.spyOn(ProxyClass, 'send');
  });
  
  methods.forEach((method, i) => {
    test(`#${method}`, () => {
      consoleProxy[method](message);
      expect(spy).toHaveBeenCalledWith(method, message);
    });
  })
});



