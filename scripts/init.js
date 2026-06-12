// World initialization - creates the player character with movement controls.
// The ThirdPersonCharacter class is loaded from scripts/lib/thirdpersoncharacter.js.
// WASD movement, mouse look, and jumping (Space) are driven by WebVerse's
// built-in rig locomotion once the character is registered as the rig avatar.

var character = new ThirdPersonCharacter(
    "Player",       // name (also used as the entity tag)
    null,           // id (auto-generated)
    -90,            // min vertical look angle (informational; rig clamps to -90/90)
    90,             // max vertical look angle (informational; rig clamps to -90/90)
    0.15,           // motion speed multiplier (rig speed = multiplier * 40 m/s)
    0.1,            // look sensitivity multiplier (rig sensitivity = multiplier * 20)
    new Vector3(0, 1, 0),  // spawn position (on the platform)
    null,           // onLoaded callback
    "desktop",      // mode
    true            // find ground (gravity enabled)
);
