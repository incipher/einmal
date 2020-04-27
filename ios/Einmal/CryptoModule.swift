
import Foundation

@objc(CryptoModule)
class CryptoModule: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

//  @objc
//  func fibonacci(_ n: Int, withCallback callback: RCTResponseSenderBlock) {
//    let result = CryptoFibonacci(n)
//    callback([result])
//  }

//  @objc
//  func fibonacci(
//    _ n: Int,
//    resolver resolve: RCTPromiseResolveBlock,
//    rejecter reject: RCTPromiseRejectBlock
//  ) -> Void {
//    let result = CryptoFibonacci(n)
//    resolve(result)
//  }

  @objc
  func scrypt(
    _ password: String,
    withSalt salt: String,
    withWorkFactor workFactor: Int,
    withBlockSize blockSize: Int,
    withParallelizationFactor parallelizationFactor: Int,
    withDerivedKeyLength derivedKeyLength: Int,
    withDerivedKeyEncoding derivedKeyEncoding: String,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let derivedKey = CryptoScrypt(
      password,
      salt,
      workFactor,
      blockSize,
      parallelizationFactor,
      derivedKeyLength,
      derivedKeyEncoding
    )

    resolve(derivedKey)
  }
}
