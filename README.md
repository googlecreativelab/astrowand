
# Astrowand

## Overview

Since 2009, coders have created thousands of experiments using Chrome, Android, AI, WebVR, AR and more. We showcase these projects and a variety of helpful tools and resources to inspire a diverse community of makers to explore, create, and share what’s possible with these technologies.

**Astrowand** is a part of the TensorFlow Microcontroller Experiments, a collection of open source, interactive projects designed to demonstrate some fun ways to combine Arduino and TensorFlow Lite for Microcontrollers. 

These projects were built with the 
[Arduino Sense 33 BLE](https://store.arduino.cc/usa/nano-33-ble-sense "Arduino Store"), [TensorFlow Lite for Microcontrollers](https://www.tensorflow.org/lite/microcontrollers "TFL4M"), standard web technologies (HTML, CSS & Javascript ) and [THREEJS](https://threejs.org/ "three").

----

## Experiment description
 [Astrowand](https://experiments.withgoogle.com/astrowand "Astrowand Google Experiment") lets you draw shapes in the sky to form constellations.

Other experiments to explore:

- [Air Snare](https://experiments.withgoogle.com/air-snare "Air Snare Google Experiment") lets you play the drums in the air.
- [Finger User Interface](https://experiments.withgoogle.com/finger-user-interface "FUI Google Experiment") or FUI (pronounced Foo-ey) lets you control connected devices with the wave of a finger.
- [Morning Mountain: Visual Alarm Clock](https://experiments.withgoogle.com/visual-alarm-clock "Morning Mountain Google Experiment") lets you stop your alarm clock from ringing by striking a pose.
- [Tiny Motion Trainer](https://experiments.withgoogle.com/tiny-motion-trainer "Tiny Motion Trainer") lets you train and test IMU based TFLite models in the browser.

----

## Tools

- Linux, MacOS or Windows computer with [Chrome](https://www.google.com/chrome/?brand=WHAR&geo=US&gclid=Cj0KCQjw9_mDBhCGARIsAN3PaFNRBCVUxmhR1QPA2LHaoELEr9yc1KkSNQ-Jc9KVZd8Sq2ux5gR6mJsaAm_6EALw_wcB&gclsrc=aw.ds "Chrome") installed
- TensorFlow Microcontroller Challenge Kit by Sparkfun or [Arduino Nano BLE Sense 33](https://store.arduino.cc/usa/nano-33-ble-sense "Arduino Nano")
- [Micro USB](https://www.google.com/search?rlz=1C5CHFA_enUS858US858&sxsrf=ALeKk01CbJTvQbYgX6arJbsjcRVmv-3-RQ:1584929968297&q=Micro+USB+cable&spell=1&sa=X&ved=2ahUKEwjl8IOexK_oAhXDqZ4KHZ0mCmcQBSgAegQIDhAn&biw=1680&bih=832 "Micro USB") cable (If you're on a USB-C laptop, instead get a [USB-C to Micro USB](https://www.google.com/search?&q=USB-C+to+Micro+USB+cable "USB-C to Micro USB") cable)
- Rubberband
- Stick or wand
- [Optional] Battery

----

## Install and Run

Flashing: Using the Arduino Nano Sense 33 BLE

1. Install the [Arduino IDE ](https://www.arduino.cc/en/software "Arduino IDE")


2. Setup Arduino board:
    -  Plug in the board
    - Install the board by navigating to Tools > Board > Boards Manager and search for  Arduino Mbed OS Nano Boards. Full instructions (including drivers required for Windows) [here.](https://www.arduino.cc/en/Guide/NANO33BLESense/ "Arduino Guide")
    - FAQ for connection problems can be found [here.](https://github.com/tinyMLx/appendix/blob/main/ArduinoFAQ.md "Arduino Guide") 
    - After the board is installed, select it under to Tools > Board >  Arduino Mbed OS Nano Boards > Arduino Nano 33 BLE
![Arduino board](/readme_images/board.png)

    - Select the port by navigating to Tools -> Port -> dev/cu... (Arduino Nano 33 BLE)
![Arduino Port](/readme_images/port.png)


3. Install Arduino libraries 
    -  Navigate to Tools > Manage Libraries
    - Search for and install:
    - Arduino_LSM9DS1
    - ArduinoBLE
    - Arduino_TensorFlowLite
![Manage libraries](/readme_images/library.png)
![TensorFlow Lite Library](/readme_images/tflib.png)

4. Open the sketch and flash
    - Download the  [Astrowand Arduino sketch file](https://experiments.withgoogle.com/astrowand/view/astrowand-arduino-sketch-v002.zip "file")
    - Unzip the downloaded Astrowand file, open the **Arduino** <folder> and double click on <astrowand.ino> file
    - Click the Right arrow in the top left corner to build and upload the sketch.  
![Arduino Port](/readme_images/buttons.png)

    - **Warning**: This process may take a few minutes. Also, warnings may populate but the upload should still succeed in spite of them.
    - If the sketch is installed, the LED on the board should flash red and green. 


5. Go to the URL related to the experiment. The URL can be found below and play!
    - [Astrowand](https://experiments.withgoogle.com/astrowand/view "Astrowand")

----

## FAQ & Common Errors

**What exactly is being transferred when I “connect”?**
WIP

**What if I’m having issues connecting via bluetooth?**
If you are having issues connecting try the following: 
1. Make sure your browser (Chrome or Edge) supports Bluetooth and it is enabled. . 
2. Make sure your device (laptop, phone, etc) supports Bluetooth and that it is working and enabled..
3. Refresh the web page,unplug the Arduino power cable and then plug it back in to reset.  , then try connecting again.

*NOTE: If you’re using a managed device, like a computer from school or work, your device policy may prevent BLE pairing.*

**My board isn’t showing up on my computer, even though it’s plugged in. What should I do?**
Try unplugging the Arduino power cable and then plug it back in to reset. Make sure you see the RGB LED blink red, green, blue in a sequential order.

**The model isn’t getting my movements right. What do I do?**
WIP

**Do you have plans to support other boards?**
We made these projects to work specifically with the Arduino Nano, and we currently don’t have plans to expand support. However, all of the code is open sourced, so you can remix or modify as needed. 

**Where should I go from here if I want to make my own model or project?**
You can create your own model in several different ways. Check out these links: 

- [Experiments Collection](https://experiments.withgoogle.com/ "Experiments Collection") - Inspiration and more resources
- [Tiny Motion Trainer](https://experiments.withgoogle.com/tiny-motion-trainer/view "Tiny Motion Trainer") - Code-free motion trainer for microcontrollers
- [Teachable Machine](https://teachablemachine.withgoogle.com/ "Teachable Machine") - Code-free image model trainer
- [TensorFlow Lite for Microcontrollers](https://www.tensorflow.org/lite/microcontrollers "TensorFlow Lite for Microcontrollers") - Full documentation 
- [Free Harvard EdX Course](https://www.edx.org/professional-certificate/harvardx-tiny-machine-learning "Harvard X Course")  - In-depth course on TensorFlow Lite for Microcontrollers and the TinyML Ecosystem `

**"What sensors do the experiments use?"**
The IMU is a LSM9DS1. It is a 3-axis accelerometer, 3-axis gyroscope and 3-axis magnetometer. This chip, made by ST Microelectronics, is a standard component supported by our library ArduinoLSM9DS1. Read more here: https://www.arduino.cc/en/Guide/NANO33BLESense

**How do you shrink a TensorFlow model to fit on a microcontroller?**
Post-training quantization is a conversion technique that can reduce model size while also improving CPU and hardware accelerator latency, with little degradation in model accuracy. You can quantize an already-trained float TensorFlow model when you convert it to TensorFlow Lite format using the TensorFlow Lite Converter. Read more here: https://www.tensorflow.org/lite/performance/post_training_quantization


----

## Note

This is not an official Google product, but a collection of experiments that were developed at the Google Creative Lab. This is not a library or code repository that intends to evolve. Instead, it is a snapshot alluding to what’s possible at this moment in time.

We encourage open sourcing projects as a way of learning from each other. Please respect our and other creators’ rights, including copyright and trademark rights when present, when sharing these works and creating derivative work. If you want more info on Google's policy, you can find that [here.](https://about.google/brand-resource-center/ "Google Brand Resource Center")

----

