const Constants = {
  User: {
    /** Maximum username length in db */
    USERNAME_LENGTH: 255,
    /** Maximum Discord snowflake length in db (Max in reality is 20) */
    DISCORD_ID_LENGTH: 64,
  },
  Sketchbook: {
    /** Maximum sketchbook name length in db */
    NAME_LENGTH: 255,
  },
  SketchbookEntry: {
    /** Maximum sketchbook entry name length in db */
    NAME_LENGTH: 255,
  },
}

export default Constants
