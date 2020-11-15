# cockpit-sensors-plugin

This is an modified version of JamesGKent's prototype for adding sensor readouts into cockpit. It utilizes the json output of lm-sensors to programmatically display all sensor data provided. Unfortunately it still depends upon lm-sensors.

## Installation

1. Install lm-sensors

2. Run `sudo sensors-detect` and either select the default response for each questions by pressing enter, or answer according to your preferences.

3. Clone this repo or copy the `cockpit-sensors-folder` folder into either:

    - `~/.local/share/cockpit` for a single user install

    - `/usr/share/cockpit` for a system wide install
