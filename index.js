/*******************************************************************
 ******************** Promisified localStorage *********************
 *******************************************************************/

/**
 * Reference :: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 */

 
// MIT License

// Copyright (c) 2018 Upendra Dev Singh

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/* eslint-disable no-undef, prefer-arrow-callback, no-var, object-shorthand, vars-on-top */
/**
 * @class
 * @constructor
 *
 * @description Storage class
 *
 */
function Storage() {
    this.storage = localStorage;
}

/**
 * @function
 * @description Read data from the storage
 * @param key
 * @returns {Object}
 */
Storage.prototype.read = function read(key) {
    try {
        var data = JSON.parse(this.storage.getItem(key));
        var val = data.val;
        var ttl = data.ttl;

        if (!ttl || !this.isTTLExpired(ttl)) {
            return val;
        }
        this.remove(key);
    } catch (e) {
        this.remove(key);
    }
    return Promise.resolve(null);
};

/**
 * @function
 * @description Writes data into the storage
 * @param key
 * @param data
 */

Storage.prototype.write = function write(key, val, maxAge) {
    var storeObj = {
        val: val,
        ttl: maxAge ? Date.now() + maxAge : null
    };
    this.store.setItem(key, JSON.stringify(storeObj));

    this.storage.length += 1;
    return Promise.resolve(storeObj);
};

Storage.prototype.update = Storage.prototype.write;

/**
 * @function
 * @description deletes given key from data base
 * @param {string} key a valid key name
 * @returns {object} storage return storage instance
 */
Storage.prototype.delete = function remove(key) {
    this.storage.removeItem(key);
    return Promise.resolve(key);
};

/**
 * @function
 * @description deletes given key from data base
 * @param {string} key a valid key name
 * @returns {object} storage return storage instance
 */
Storage.prototype.flush = function flush(key) {
    this.storage.removeItem(key);
    return Promise.resolve(key);
};

Storage.prototype.flushAll = function flushAll() {
    this.storage = null;
    this.storage = { length: 0 };
};

Storage.prototype.isTTLExpired = function isTTLExpired(expirationTime) {
    return Date.now() > expirationTime;
};

(function component(ClassToBeInstaintiated) {
    if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        module.exports = ClassToBeInstaintiated;
    } else if (typeof define === 'function' && typeof define.amd === 'object') {
        define(function cb() {
            return ClassToBeInstaintiated;
        });
    } else {
        window.__browser_storage__ = ClassToBeInstaintiated;
    }
}(Storage));
