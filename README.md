<div align="center">
  <img src="https://user-images.githubusercontent.com/11808903/77279674-9d7ea780-6cc2-11ea-9a8f-381ee2eee398.png" width="200"/>

  <h1>Einmal</h1>

  <div>
    <i>/ˈainmaːl/</i>
  </div>

  <div>
    <b>German: once</b>
  </div>

  <p>The minimalistic, secure and open-source two-factor authentication app.</p>
</div>

## Features

- 🔒 Encryption by default — your vault is never stored in plaintext
- 🚀 Import & export vault — back up your vault securely anywhere you like
- 🙈 Discreet mode — conceals your tokens in public
- 📸 Screenshot protection — protects against screen-capturing malware
- 🏴 AMOLED dark theme — because why would you have it any other way?

## Supported Algorithms

- ⏱ 6-digit time-based one-time password (TOTP) authentication [(RFC 6238)](https://tools.ietf.org/html/rfc6238)

## Security

- Entropy: [Java's SecureRandom](https://developer.android.com/reference/java/security/SecureRandom) | [Objective-C's SecRandomCopyBytes](https://developer.apple.com/documentation/security/1399291-secrandomcopybytes)
- Key derivation: [scrypt (Go implementation)](https://godoc.org/golang.org/x/crypto/scrypt)
- Encryption & message authentication: [NaCl's XSalsa20-Poly1305 (JavaScript port)](https://github.com/dchest/tweetnacl-js)

## Tech

- [React Native](https://reactnative.dev/) (mostly using [Expo](https://expo.io/))
  - To support both Android & iOS
- [Go Mobile](https://github.com/golang/go/wiki/Mobile)
  - To offload the blocking key derivation workload to the UI thread
  - To write once in Go and generate bindings for both Android & iOS
  - To utilize Go's outstanding crypto package

## Roadmap

- [ ] Facilitate web/CLI vault decryption (escape hatch)
- [ ] Facilitate manual key entry
- [ ] Facilitate biometric unlock
- [ ] Offload encryption to Go
- [ ] Implement light theme
- [ ] Produce iOS build
- [ ] Write tests

## Screenshots

<span>
  <img src="https://user-images.githubusercontent.com/11808903/80574712-a3268600-8a02-11ea-823d-314aa2e699a3.png" width="300"/>

  <img src="https://user-images.githubusercontent.com/11808903/80574717-a457b300-8a02-11ea-915e-db7cd98740f2.png" width="300"/>
</span>

## Feedback

Your feedback is most welcome! Please get in touch by email: support@incipher.io.

## Thanks

- [alexbakker](https://github.com/alexbakker) & [michaelschattgen](https://github.com/michaelschattgen): for building and open-sourcing my personal favorite two-factor authentication app [Aegis](https://github.com/beemdevelopment/Aegis). Einmal is inpired by its clean UI and well-thought-out security design.

## License

<a href="https://unlicense.org">The Unlicense</a>
