/*
 * b64.js
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

var b64 = {};

b64.encode = function base64_encode(message) {
  if(typeof message !== "string") {
    throw new Error("Argument is not a string");
  }
  return new Buffer(message).toString('base64');
};

b64.decode = function base64_decode(message) {
  if(typeof message !== "string") {
    throw new Error("Argument is not a string");
  }
  return new Buffer(message, 'base64').toString('utf8');
};

module.exports = b64;