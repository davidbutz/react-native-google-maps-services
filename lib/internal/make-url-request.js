/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var axios = require('axios');
var version = require('../version');

/**
 * Makes a secure HTTP GET request for the given URL.
 *
 * Calls the callback with two parameters (err, response). If there was an
 * error, response should be null. If there was no error, err should be null,
 * and response should be an object with these properties
 * {
 *   status: number,
 *   headers: Object,
 *   json: Object
 * }
 *
 * Returns a function that cancels the request.
 *
 * @param {Object} axiosConfig
 * @param {function(ClientResponse)} onSuccess
 * @param {function(?)} onError
 * @param {Object} options
 * @return {function()}
 */
module.exports = function makeUrlRequest(axiosConfig, onSuccess, onError, options) {
  // Allow each API to provide some of the request options such as the
  // HTTP method, headers, etc.
  if (options) {
    for (var k in options) {
      if (k === 'body') {
        axiosConfig['data'] = options[k];
      } else {
        axiosConfig[k] = options[k];
      }
    }
  }

  var instance = axios.create(axiosConfig);

  var userAgent = 'GoogleGeoApiClientJS/' + version;
  instance.defaults.headers.common['User-Agent'] = userAgent;
  // add keep-alive header to speed up request
  instance.defaults.headers.common['Connection'] = 'keep-alive';

  instance.request().then(function (response) {
    if (response.headers['content-type'] == 'application/json; charset=UTF-8') {
      // Handle JSON.
      onSuccess({
        status: response.status,
        headers: response.headers,
        json: response.data,
      });
    } else {
      // Fallback is for binary data, namely places photo download,
      // so just provide the response stream. Also provide the same
      // consistent name for status checking as per JSON responses.
      onSuccess(response);
    }
  })
  .catch(function (error) {
    onError(error);
  });

  return function cancel() { instance.cancel('Request was cancelled.'); };
};
