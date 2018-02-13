React Native Client for Google Maps Services
=======================================

This is a fork of [google-maps-services-js](https://github.com/googlemaps/google-maps-services-js) that removes as many core Node.js modules as possible to allow developers to use the library in React Native without the need for shims via projects such as [node-libs-react-native](https://github.com/parshap/node-libs-react-native), [ReactNativify](https://github.com/philikon/ReactNativify), or [rn-nodeify](https://github.com/tradle/rn-nodeify).

The current implementation leverages [axios](https://github.com/axios/axios) to replace http/https and adds the following dependencies:

* [buffer](https://github.com/feross/buffer)
* [crypto-js](https://github.com/brix/crypto-js)

A detailed explanation of what was changed and why can be read here in my blog post here: [Forking google-maps-services-js](https://lovescomputers.com/blog/forking-google-maps-services-js/). It also goes into depth on what functionality was removed. For example, there is no cli anymore since that is not needed by React Native.

**Disclaimer**

While this current works, there are several outstanding issues that I need to fix before this can be considered production ready. A short list of the biggest issues are:

* [ ] `geolocate` is no longer functional due to these outstanding issues/PR in axios: [#723](https://github.com/axios/axios/issues/723) [#1342](https://github.com/axios/axios/pull/1342) [#1121](https://github.com/axios/axios/issues/1121). Once the PR is merged and released, I will be able to update the dependencies.
* [ ] A number of task related spec tests are failing due to the use of `setImmediate` over `process.nextTick`.
* [ ] A large number of e2e tests fail. However, these same tests also fail in a clean checkout of the original [google-maps-services-js](https://github.com/googlemaps/google-maps-services-js).
* [ ] Grabbing streaming responses via chunking is no longer possible.
* [ ] Keep alive may no longer be functional (requires testing).

## Intro

This library brings the [Google Maps API Web Services] to your React Native application.

The React Native Client for Google Maps Services is an [axios](https://github.com/axios/axios) backed Client library for the following Google Maps APIs:

 - [Directions API]
 - [Distance Matrix API]
 - [Elevation API]
 - [Geocoding API]
 - [Places API]
 - [Roads API]
 - [Time Zone API]

Keep in mind that the same [terms and conditions](https://developers.google.com/maps/terms)
apply to usage of the APIs when they're accessed through this library.

## Features

 - **Retry on Failure** Automatically retry when intermittent failures occur.
   That is, when any of the retryable 5xx errors are returned from the API.

 - **Rate-limiting** Requests are rate-limited by the client, which helps
   prevent reaching the server-enforced rate limit.

## Quick Start

    $ npm install react-native-google-maps-services

**Note:** You'll need to have npm 2.7.0 or greater installed, since this library is hosted as a
[scoped package](https://docs.npmjs.com/getting-started/scoped-packages).

Create a new client object by calling `createClient()`

```js
var googleMapsClient = require('react-native-google-maps-services').createClient({
  key: 'your API key here'
});
```

Make requests to the Google Maps APIs by calling methods on the client object.

```js
// Geocode an address.
googleMapsClient.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
}, function(err, response) {
  if (!err) {
    console.log(response.json.results);
  }
});
```

For more usage examples, check out [the tests](spec/e2e/).

View the [reference documentation](https://googlemaps.github.io/google-maps-services-js/docs/)

Additional documentation for the included web services is available at
https://developers.google.com/maps/.

## API keys

Each Google Maps Web Service request requires an API key or client ID. API keys
are freely available with a Google Account at
https://developers.google.com/console. The type of API key you need is a
**Server key**.

To get an API key:

 1. Visit https://developers.google.com/console and log in with
    a Google Account.
 1. Select one of your existing projects, or create a new project.
 1. Enable the API(s) you want to use. The Node.js Client for Google Maps Services
    accesses the following APIs:
    * Directions API
    * Distance Matrix API
    * Elevation API
    * Geocoding API
    * Places API
    * Roads API
    * Time Zone API
 1. Create a new **Server key**.
 1. If you'd like to restrict requests to a specific IP address, do so now.

For guided help, follow the instructions for the [Directions API][directions-key]. You only need one API key, but
remember to enable all the APIs you need.
For even more information, see the guide to [API keys][apikey].

When you have an API key, you can create a client object:

```js
var googleMapsClient = require('react-native-google-maps-services').createClient({
  key: 'your API key here'
});
```

### Client IDs

Google Maps APIs Premium Plan customers can use their [client ID and secret][clientid] to authenticate,
instead of an API key.

```js
var googleMapsClient = require('react-native-google-maps-services').createClient({
  clientId: 'Add your client ID here',
  clientSecret: 'Add your client secret here',
});
```

**Important:** This key should be kept secret on your server.

## Developing

In order to run the end-to-end tests, you'll need to supply your API key via an
environment variable.

    $ export GOOGLE_MAPS_API_KEY=AIza-your-api-key
    $ npm test

## Support

This library is community supported. We're comfortable enough with the
stability and features of the library that we want you to build real
production applications on it. We will try to support, through Stack
Overflow, the public surface of the library and maintain
backwards compatibility in the future; however, while the library is in
version 0.x, we reserve the right to make backwards-incompatible
changes. If we do remove some functionality (typically because better
functionality exists or if the feature proved infeasible), our intention
is to deprecate and give developers a year to update their code.

If you find a bug, or have a feature suggestion, please
[log an issue][issues]. If you'd like to contribute, please read
[How to Contribute][contrib].

[apikey]: https://developers.google.com/maps/faq#keysystem
[clientid]: https://developers.google.com/maps/documentation/business/webservices/auth

[Google Maps API Web Services]: https://developers.google.com/maps/documentation/webservices/
[Directions API]: https://developers.google.com/maps/documentation/directions/
[directions-key]: https://developers.google.com/maps/documentation/directions/get-api-key#key
[Distance Matrix API]: https://developers.google.com/maps/documentation/distancematrix/
[Elevation API]: https://developers.google.com/maps/documentation/elevation/
[Geocoding API]: https://developers.google.com/maps/documentation/geocoding/
[Time Zone API]: https://developers.google.com/maps/documentation/timezone/
[Roads API]: https://developers.google.com/maps/documentation/roads/
[Places API]: https://developers.google.com/places/web-service/

[issues]: https://github.com/googlemaps/google-maps-services-js/issues
[contrib]: https://github.com/googlemaps/google-maps-services-js/blob/master/CONTRIBUTING.md
