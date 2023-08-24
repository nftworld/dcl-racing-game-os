export default {
  backend: {
    syncInterval: 200, // ms
    positionInterval: 500, // ms
    leaderboardUpdateInterval: 5000, // ms
    // url: 'https://example.ngrok-free.app/projectid/region' // use ngrok for local emulators (DCL requires https)
    url: 'https://region-projectid.cloudfunctions.net'
  },

  game: {
    enablePaidGames: false, // Set to true to enable paid games
    playerLimit: 4, // Maximum players per game
    timeLimit: 60000 * 3, // Must match backend GAME_TIME_LIMIT
    disableStartGate: true, // Set to true to disable the start gate
    showTrackIDs: false, // Used for dev to show track IDs
    teleportUp: false, // Used for dev to quickly get to the last track section on the way up
    teleportDown: false, // Used for dev to quickly get back to the first track section on the way down
    fakeUsers: [] // List of user addresses to use as fake opponents - for development
  },

  fees: {
    entryFee: 5, // MANA
    skip: false, // For development, paid games don't collect fees
    metaTxServer: undefined, // Define to use a custom meta tx server
    escrowAddress: '0xYOURADDRESSHERE'
  },

  scene: {
    yBase: 0,
    xMinBoundary: 8,
    xMaxBoundary: 40,
    yMinBoundary: 0,
    yMaxBoundary: 60,
    zMinBoundary: 32,
    zMaxBoundary: 64,
    pole: {
      x: 38.75,
      y: 1,
      z: 38.75
    },
    finished: {
      x: 38.54,
      y: 2.89,
      z: 58.09
    }
  },

  splash: {
    first: 'images/racing-game/splash-screens/1st.png',
    second: 'images/racing-game/splash-screens/2nd.png',
    secondBronze: 'images/racing-game/splash-screens/2nd-bronze.png',
    third: 'images/racing-game/splash-screens/3rd.png',
    fourth: 'images/racing-game/splash-screens/4th.png'
  },

  trackOrder: [
    [],
    [8, 3, 7, 4],
    [9, 1, 5, 2, 6, 3, 7, 4],
    [10, 1, 5, 2, 6, 3, 7, 4],
    [11, 1, 5, 2, 6, 3, 7, 4, 14, 12, 13, 15]
  ],

  cornerIntersections: {
    1: { x: 2.6, z: 1.88 },
    2: { x: 29.28, z: 0.5 },
    3: { x: 28.6, z: 29.19 },
    4: { x: 2.83, z: 29.19 }
  }
}
