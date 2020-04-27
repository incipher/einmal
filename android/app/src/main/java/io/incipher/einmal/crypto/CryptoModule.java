package io.incipher.einmal.crypto;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import crypto.Crypto;

public class CryptoModule extends ReactContextBaseJavaModule {
    public CryptoModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CryptoModule";
    }

    @ReactMethod
    public void scrypt(
        String password,
        String salt,
        int workFactor,
        int blockSize,
        int parallelizationFactor,
        int derivedKeyLength,
        String derivedKeyEncoding,
        Promise promise
    ) {
        Runnable task = () -> {
            String derivedKey = Crypto.scrypt(
                password,
                salt,
                workFactor,
                blockSize,
                parallelizationFactor,
                derivedKeyLength,
                derivedKeyEncoding
            );

            promise.resolve(derivedKey);
        };

        new Thread(task).start();
    }
}
