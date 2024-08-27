var noble = require('@abandonware/noble');
var readlineSync = require('readline-sync');

console.log('Scanning for BLE devices...');

var devicesToConnect = [];

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        console.log('Bluetooth is active, starting scan...');
        noble.startScanning();
       setTimeout(function() {
            console.log('Scan finished.');
            noble.stopScanning();
        }, 4000);

    } else {
        console.log('Bluetooth is not active');
        noble.stopScanning();
    }
});

noble.on('discover', function(peripheral) {
if (peripheral.advertisement.localName !== undefined) {
    console.log('Peripheral found:');
    console.log('  Local Name: ' + peripheral.advertisement.localName);
    console.log('  UUID: ' + peripheral.uuid);
    console.log('  MAC Address: ' + peripheral.address);
    console.log('  Service UUIDs: ' + peripheral.advertisement.serviceUuids);
    console.log();

    devicesToConnect.push({
            peripheral: peripheral,
            isConnected: false
        });
}
     
});

noble.on('scanStop', function() {
    if (devicesToConnect.length === 0) {
        console.log('No BLE devices found.');
        return;
    }

    console.log('Found devices:');
    devicesToConnect.forEach(function(device, index) {
        console.log(index + ': ' + device.peripheral.advertisement.localName + ' (' + device.peripheral.address + ')');
    });

     var selectedIndices = readlineSync.question('Enter the indices of the devices you want to connect to (separated by commas): ');
    var selectedIndexes = selectedIndices.split(',').map(function(index) {
        return parseInt(index.trim());
    });
 selectedIndexes.forEach(function(index) {
        if (devicesToConnect[index]) {
            connectToDevice(devicesToConnect[index]);
        }
    });
});


function connectToDevice(deviceInfo) {
    var selectedDevice = deviceInfo.peripheral;
    selectedDevice.connect(function(error) {
        if (error) {
            console.error('Error connecting to peripheral:', error);
            return;
        }
        console.log('Connected to peripheral:', selectedDevice.uuid);
        deviceInfo.isConnected = true;
        discoverServicesAndCharacteristics(selectedDevice);
    });
function discoverServicesAndCharacteristics(selectedDevice) {
    selectedDevice.discoverAllServicesAndCharacteristics(function(error, services, characteristics) {
        if (error) {
            console.error('Error discovering services and characteristics:', error);
            selectedDevice.disconnect();
            return;
        }

        console.log('Services and characteristics discovered for device:', selectedDevice.uuid);

        // Loop through characteristics
        characteristics.forEach(function(characteristic) {
            // Check if the characteristic supports notifications
            if (characteristic.properties.includes('notify')) {
                   var newValue = Buffer.from('8000', 'utf-8');
                writeCharacteristic(characteristic, newValue);
                // Subscribe to notifications
                characteristic.subscribe(function(error) {
                    if (error) {
                        console.error('Error subscribing to characteristic:', error);
                    } else {
                        console.log('Subscribed to characteristic:', characteristic.uuid);
                    }
                });

                // Listen for characteristic value changes
                characteristic.on('data', function(data, isNotification) {
                    if (isNotification) {
                        console.log('Characteristic value changed for', characteristic.uuid + ':', data.toString('utf-8'));
                        // If it's a notification, read the new value
                        readCharacteristic(characteristic);
                    } else {
                        //console.log('Existing characteristic value:', data.toString('utf-8'));
                        // If it's not a notification, no need to read, just log the existing value
                    }
                });

                
               
            }
        });
    });
}

function readCharacteristic(characteristic) {
    characteristic.read(function(error, data) {
        if (error) {
            console.error('Error reading characteristic:', error);
        } else {
            console.log('Read characteristic value for', characteristic.uuid + ':', data.toString('utf-8'));

        }
    });
}

function writeCharacteristic(characteristic, value) {
    characteristic.write(value, true, function(error) {
        if (error) {
            console.error('Error writing to characteristic:', error);
        } else {
            console.log('Write successful');
        }
    });
}
}



