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

import BLEReceiver from "./BLEReceiver";

function BLE_SENSE_UUID(val) {
  return "4798e0f2-" + val + "-4d68-af64-8a8f5258404e";
}
const serviceUUID = BLE_SENSE_UUID("0000");
const strokeCharacteristicUUID = BLE_SENSE_UUID("300a");
const jsonCharacteristicUUID = BLE_SENSE_UUID("300b");

const inferenceReceiver = new BLEReceiver(
  serviceUUID,
  jsonCharacteristicUUID,
  handleInferenceDataReceived,
  true
);

const strokeReceiver = new BLEReceiver(
  serviceUUID,
  strokeCharacteristicUUID,
  handleStrokeDataReceived,
  false
);

let dataCallback;

if (!("bluetooth" in navigator)) {
  alert("Error: This browser doesn't support Web Bluetooth.");
}

function decodeString(dataView, encoding = "utf8") {
  const decoder = new TextDecoder(encoding);
  const result = decoder.decode(dataView);
  return result;
}

function handleInferenceDataReceived(dataView) {
  let jsonStr = decodeString(dataView);
  const json = JSON.parse(jsonStr);
  dataCallback("inference", json);
}

function getStrokePoints(dataview, byteOffset, littleEndian) {
  const result = [];
  const currentOffset = byteOffset;
  for (let i = 0; i < STROKE_POINT_COUNT; ++i) {
    var entry = {};
    entry.x = dataview.getInt8(currentOffset, littleEndian) / 128.0;
    currentOffset += 1;
    entry.y = dataview.getInt8(currentOffset, littleEndian) / 128.0;
    currentOffset += 1;
    result.push(entry);
  }
  return result;
}

function handleStrokeDataReceived(dataView) {
  
  const littleEndian = true;
  const STROKE_POINT_COUNT = 160;

  let byteOffset = 0;
  const INT32_SIZE = 4; //bytes
  const state = dataView.getInt32(byteOffset,true);
  byteOffset += INT32_SIZE;
  const length = Math.min(dataView.byteLength - 8, dataView.getInt32(byteOffset, true));
  byteOffset += INT32_SIZE;
  const points = [];
  for (let i = 0; i < Math.min(dataView.byteLength - 8, STROKE_POINT_COUNT * 2); i+= 2) {
    var entry = {};
    entry.x = dataView.getInt8(byteOffset + i, littleEndian) / 128.0;
    entry.y = dataView.getInt8(byteOffset + i + 1, littleEndian) / 128.0;
    points.push(entry);
  }
  // console.log("got", result);
  dataCallback("strokes", {state, length, points});
  //  return result;
}

export default {
  async connect(cb) {
    if (typeof cb !== "function") {
      throw new Error(
        "ble/manager.connect requires a data callback as first parameter"
      );
    }
    await inferenceReceiver.connect();
    await strokeReceiver.connect();
    dataCallback = cb || dataCallback;
  },

  disconnect() {
    inferenceReceiver.disconnect();
    strokeReceiver.disconnect();
  },
};
