
#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(CryptoModule, NSObject)

//RCT_EXTERN_METHOD(fibonacci: (int)n withCallback:(RCTResponseSenderBlock)callback)

//RCT_EXTERN_METHOD(
//  fibonacci: (int)n
//  resolver: (RCTPromiseResolveBlock)resolve
//  rejecter: (RCTPromiseRejectBlock)reject
//)

RCT_EXTERN_METHOD(
  scrypt: (NSString)password
  withSalt: (NSString)salt
  withWorkFactor: (int)workFactor
  withBlockSize: (int)blockSize
  withParallelizationFactor: (int)parallelizationFactor
  withDerivedKeyLength: (int)derivedKeyLength
  withDerivedKeyEncoding: (NSString)derivedKeyEncoding
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

@end
