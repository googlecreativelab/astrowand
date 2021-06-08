// Copyright 2021 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     https://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let deviceCache = {};

const log = ((...args) => {
    console.log("%c -> BLEReceiver.js " + args.join(', '), "background: DarkOliveGreen; color: #F0F2F6; display: block;");
});

const warn = ((...args) => {
    console.warn("%c -> BLEReceiver.js " + args.join(', '), "background: DarkOliveGreen; color: #F0F2F6; display: block;");
})

class BLEReceiver {
    constructor(serviceUUID, characteristicUID, callback, subscribe = true) {
        this.serviceUUID = serviceUUID;
        this.characteristicUID = characteristicUID;
        this.callback = callback;
        this.handleCharacteristicValueChanged = this.handleCharacteristicValueChanged.bind(this);
        this.handleDisconnection = this.handleDisconnection.bind(this);
        this.subscribe = subscribe;
    }

    // Enable the characteristic changes notification
    async startNotifications(characteristic) {
        if(this.subscribe){
            log('Starting notifications.');
            await characteristic.startNotifications();
            log('Notifications started');
            characteristic.addEventListener('characteristicvaluechanged', this.handleCharacteristicValueChanged);
        } else {
            const pollLoop = async ()=>{
                const value = await characteristic.readValue();
                this.callback(value); 
                this._pollTimout = setTimeout(pollLoop, 200);
            };
            pollLoop();
        }
    }

    async connect() {
        if (this.bluetoothDevice) return this.bluetoothDevice;

        let device;
        if (deviceCache[this.serviceUUID] instanceof Promise) {
            device = await deviceCache[this.serviceUUID];
        } else {
            if (deviceCache[this.serviceUUID]) {
                device = deviceCache[this.serviceUUID];
            } else {
                const devicePromise = navigator.bluetooth.requestDevice({
                    filters: [{ services: [this.serviceUUID] }],
                    optionalServices: [this.serviceUUID],
                    acceptAllDevice: true
                });
                deviceCache[this.serviceUUID] = devicePromise;
                device = await devicePromise;
                deviceCache[this.serviceUUID] = device;
            }
            log(`Connecting to ${device.name}`);
        }
        this.bluetoothDevice = device;
        const char = await this.connectDeviceAndCacheCharacteristic(device);
        this.currentCharacteristic = char;
        await this.startNotifications(char);
    }

    disconnect() {
        if (this.bluetoothDevice) {
            log(`Disconnecting from ${this.bluetoothDevice.name}`);
            this.bluetoothDevice.removeEventListener('gattserverdisconnected', this.handleDisconnection);
            clearTimeout(this._pollTimout);
            if (this.bluetoothDevice.gatt.connected) {
                this.bluetoothDevice.gatt.disconnect();
                log(`Disconnected from ${this.bluetoothDevice.name}`);
            }
            else {
                log(`${this.bluetoothDevice.name} is not connected`);
            }
            
        }


        if (this.currentCharacteristic) {
            this.currentCharacteristic.removeEventListener('characteristicvaluechanged', this.handleCharacteristicValueChanged);
            this.currentCharacteristic = null;
        }

        this.bluetoothDevice = null;
    }

    handleCharacteristicValueChanged(event) {
        const dataView = event.target.value;
        if (this.callback) {
            this.callback(dataView);
        }
    }

    async handleDisconnection(event) {
        let device = event.target;
        warn(`Device ${device.name} disconnected. Attempting to reconnect`);
        if (this.currentCharacteristic) {
            if(this.subscribe){
                this.currentCharacteristic.removeEventListener('characteristicvaluechanged', this.handleCharacteristicValueChanged);
            } else {
                clearTimeout(this._pollTimout)
            }
        }
        const characteristic = await this.connectDeviceAndCacheCharacteristic(device);
        this.currentCharacteristic = char;
        this.startNotifications(characteristic);
    }

    async connectDeviceAndCacheCharacteristic(device) {
        if (device.gatt.connected && this.currentCharacteristic) {
            return Promise.resolve(this.currentCharacteristic);
        }

        log('Connecting to GATT server');
        const server = await device.gatt.connect();
        log(`Server connected, getting service ${this.serviceUUID}`);
        const service = await server.getPrimaryService(this.serviceUUID);
        log(`Service found. Getting characteristic ${this.characteristicUID}`)
        const char = await service.getCharacteristic(this.characteristicUID);
      
        log('Done connecting to the GATT server!')
        return char;
    }

    destroy() {
        this.disconnect();
        this.serviceUUID = null;
        this.characteristicUID = null;
    }

}

export default BLEReceiver;