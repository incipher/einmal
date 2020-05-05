<div align="center">
  <img src="https://user-images.githubusercontent.com/11808903/77279674-9d7ea780-6cc2-11ea-9a8f-381ee2eee398.png" width="200"/>

  <h1>Einmal</h1>

  <div>
    <i>/ˈainmaːl/</i>
  </div>

  <div>
    <b>German: once</b>
  </div>

  <p>The minimalistic, secure and open-source <a href="https://ssd.eff.org/en/module/how-enable-two-factor-authentication">two-factor authentication</a> app.</p>
</div>

## Features

- ♻️ Cross-platform — available on Android & iOS (coming soon)
- 🔒 Encryption by default — your vault is never stored in plaintext
- 👱‍♂️ Biometric unlock — decrypt your vault using biometrics
- 🚀 Import & export vault — back up your vault securely anywhere you like
- 🙈 Discreet mode — conceal your tokens in public
- 📸 Screenshot protection — immune to screen-capturing malware
- 🏴 AMOLED dark theme — because why would you have it any other way?

## Supported Algorithms

- ⏱ 6-digit time-based one-time password (TOTP) authentication [(RFC 6238)](https://tools.ietf.org/html/rfc6238)

## Security

- Encryption & message authentication: [NaCl's XSalsa20-Poly1305 (JavaScript port)](https://github.com/dchest/tweetnacl-js)
- Key derivation: [scrypt (Go implementation)](https://godoc.org/golang.org/x/crypto/scrypt)
- Entropy: [Java's SecureRandom](https://developer.android.com/reference/java/security/SecureRandom) | [Objective-C's SecRandomCopyBytes](https://developer.apple.com/documentation/security/1399291-secrandomcopybytes)

## Tech

- [React Native](https://reactnative.dev/) (mostly using [Expo](https://expo.io/))
  - To support both Android & iOS
- [Go Mobile](https://github.com/golang/go/wiki/Mobile)
  - To offload the blocking key derivation workload to the UI thread
  - To write once in Go and generate bindings for both Android & iOS
  - To utilize Go's outstanding crypto package

## Roadmap

- [x] Facilitate biometric unlock
- [ ] Facilitate manual key entry
- [ ] Facilitate web/CLI vault decryption (escape hatch)
- [ ] Offload encryption to Go
- [ ] Design light theme
- [ ] Produce iOS build
- [ ] Write tests

## Screenshots

<span>
  <img src="https://user-images.githubusercontent.com/11808903/81027399-ee66eb80-8e7d-11ea-84d0-60686d2d32f6.png" width="300"/>

  <img src="https://user-images.githubusercontent.com/11808903/80574717-a457b300-8a02-11ea-915e-db7cd98740f2.png" width="300"/>
</span>

## Feedback

Your feedback is most welcome! Please get in touch by email: support@incipher.io.

## License

<a href="https://creativecommons.org/publicdomain/zero/1.0/">Creative Commons Zero v1.0 Universal</a>
