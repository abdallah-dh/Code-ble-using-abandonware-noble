# Code-ble-using-abandonware-noble
A Node.js BLE (Bluetooth Low Energy) central module.

## Install

```sh
npm install @abandonware/noble
```
## Usage

```javascript
var noble = require('@abandonware/noble');
```
### Actions

#### Start scanning

```javascript
noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        console.log('Bluetooth is active, starting scan...');
        noble.startScanning();
       setTimeout(function() {
            console.log('Scan finished.');
            noble.stopScanning();
        }, 4000); 4s for scanning 

    } else {
        console.log('Bluetooth is not active');
        noble.stopScanning();
    }
});
#### Stop scanning

```javascript
noble.stopScanning();
```
##### Connect

```javascript
peripheral.connect([callback(error)]);
```
##### Disconnect or cancel pending connection

```javascript
peripheral.disconnect([callback(error)]);
```
##### Discover services

```javascript
peripheral.discoverServices(); // any service UUID

var serviceUUIDs = ["<service UUID 1>", ...];
peripheral.discoverServices(serviceUUIDs[, callback(error, services)]); // particular UUID's
```
##### Discover all services and characteristics

```javascript
peripheral.discoverAllServicesAndCharacteristics([callback(error, services, characteristics)]);
```
##### Discover characteristics

```javascript
service.discoverCharacteristics() // any characteristic UUID

var characteristicUUIDs = ["<characteristic UUID 1>", ...];
service.discoverCharacteristics(characteristicUUIDs[, callback(error, characteristics)]); // particular UUID's
```
#### Characteristic

##### Read

```javascript
characteristic.read([callback(error, data)]);
```
##### Write

```javascript
characteristic.write(data, withoutResponse[, callback(error)]); // data is a buffer, withoutResponse is true|false
```

* ```withoutResponse```:
  * ```false```: send a write request, used with "write" characteristic property
  * ```true```: send a write command, used with "write without response" characteristic property
##### Subscribe

```javascript
characteristic.subscribe([callback(error)]);
```
##### Unsubscribe

```javascript
characteristic.unsubscribe([callback(error)]);
```

  * unsubscribe to a characteristic
  * use for characteristics with notify or indicate properties

##### Discover descriptors

```javascript
characteristic.discoverDescriptors([callback(error, descriptors)]);
```
##### Read value

```javascript
descriptor.readValue([callback(error, data)]);
```
##### Write value

```javascript
descriptor.writeValue(data[, callback(error)]); // data is a buffer
```
