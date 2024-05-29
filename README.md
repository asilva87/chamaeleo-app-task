## Chamaeleo App Task / GetPlanned GmbH

This is an app I built for the selection process at GetPlanned GmbH.

<p align="center">
  <img src="/assets/images/home-page.png" alt="Home page" width="300"/>
  <img src="/assets/images/history-page.png" alt="History page" width="300"/>
</p>

### How to run?

- Open Android Studio.
- `bun install` or any other package manager.
- Run the AVD.
- On the terminal, run `npm start`.

### About the app

It is a mock app where the one user clicks on a button to "check in", that means, to inform the system they're starting their shift.

If there's connection, the app will mock an API request and show an animation indicating success. Otherwise, it will store the check in data locally to send it later when internet connection is reestablished.

There's a **History** page to check all the check ins done through the app. These are stored locally. The page indicates:

- If that check in was successful
- If it is still pending
- If it was sending after internet connection was reestablished

A slider switch mocks the network availability by manually turning it on or off.

### Things to note

- No routing was used because it's a very simple app.
- Several check ins can be done without internet connection. Upon reconnection, they will all be "sent" to the "API".
- When the connection is back, the **success** animation is displayed to show the user that check in logs have been sent.
- By default, the app gets initialised with the "internet connection" turned on. So any pending logs in the local storage will be "sent" to the "API" and the user will see the **success** animation.
- Certain elements have different colors depending on the state of the network, so that the user is constantly aware of its status.
- Upon doing a check in without internet, a different animation will be shown to bring attention to that.

#### Tested on Android
