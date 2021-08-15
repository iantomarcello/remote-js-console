/**
 * Creates a connection to the WebSocket server and a Proxy to 
 * browsers' `console` API.
 * @param {string} wsUrl url to the WebSocket, usually its 
 * `ws://localhost:8080` 
 */

export class ConsoleProxy {
  constructor(wsUrl) {
    const userAgent = navigator.userAgent.split(' ').shift();
    const id = Math.random() * 100;

    this._proxy = null;
    this._ws = new WebSocket(wsUrl);
    this._id = userAgent + '&id=' + id;

    this._ws.onerror = (error) => {
      console.error(error);
    }

    this._ws.onclose = (close) => {
      console.log(close);
    }

    this._ws.onopen = () => {
      this.send('connect', this._id);
      this.createProxy();
    }
  }

  /**
   * Creates the `console` Proxy and update `_proxy`
   */
  createProxy() {
    const self = this;
    this._proxy = new Proxy(console, {
      get: (target, property) => {
        if ( typeof target[property] === 'function' ) {
          return function(args) {
            self.send(property, args);
            return target[property](args);
          }
        }
      },
    });
  }

  /**
   * Get the Proxy object of `console`
   * @returns {Promise<Console>} a Promise which resolves the `console` Proxy
   * @usage 
   * ``` 
   * const consoleProxy = await ConsoleProxyInstance.getProxy();
   * consoleProxy.log('pikachu 🐭'); // logs on browser and also sends to WebSocket server.
   * ``` 
   */

  getProxy() {
    return new Promise(resolve => {
      this._ws.addEventListener('open', () => {
        resolve(this._proxy);
      });
    }).catch(console.error);
  }

  /**
   * Returns the WebSocket instance.
   */
  get ws() {
    return this._ws;
  }

  /**
   * Fires WebSocket.send and sends data to the WebSocket Server.
   * @param {string | Symbol} key The identifier of what kind of message is sent.
   * @param {any} messages The message to pass along, can be anything.
   */
  send(key, messages) {
    const data = JSON.stringify({ key, messages, })
    this._ws.readyState && this._ws.send(data);
  }
}