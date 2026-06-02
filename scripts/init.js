// World initialization - creates the player character with movement controls.
// The ThirdPersonCharacter class is loaded from scripts/lib/thirdpersoncharacter.js.

var character = new ThirdPersonCharacter(
    "Player",       // name
    null,           // id (auto-generated)
    -90,            // min vertical look angle
    90,             // max vertical look angle
    0.15,           // motion speed multiplier
    0.1,            // rotation speed multiplier
    new Vector3(0, 1, 0),  // spawn position (on the platform)
    null,           // onLoaded callback
    "desktop",      // mode
    true            // find ground (gravity enabled)
);
