// Interface source from https://github.com/marcopixel/r6operators/blob/master/src/types/operator.d.ts
// Slighly modified to fit the needs of this project.

export default interface Operator {
  /** Unique identified used for MeiliSearch */
  id: number;
  /** Readable name of the operator */
  name: string;
  /** Description of the operator */
  description: string;
  /** Quote of the operator */
  quote: string;
  /** Image of the operator */
  poster: string;
  /** Discord emoji for the operator */
  emoji: string;
  /** Role of the operator.
   *
   *  Possible values are `Attacker`, `Defender` or `Recruit`
   */
  role: "Attacker" | "Defender" | "Recruit";
  /** Shortened name of the operator's unit */
  unit: string;
  /** Object containing the health, speed and difficulty ratings. */
  ratings?: OperatorRatings;
  /** Object containing metadata of the operator. */
  meta?: OperatorMeta;
  /** Object containing biography of the operator. */
  bio?: OperatorBio;
  /** Object containing the unlock prices of the operator . */
  unlock?: OperatorUnlock;
}

interface OperatorRatings {
  /** Health rating as a number between `1` and `3` */
  health: number;
  /** Speed rating as a number between `1` and `3` */
  speed: number;
  /** Difficulty rating as a number between `1` and `3` */
  difficulty: number;
}

interface OperatorMeta {
  /** Gender of the operator.
   *
   *  Possible values are:
   *  ```
   *  'm' - Male
   *  'f' - Female
   *  'o' - Other
   *  'n' - None/Not applicable
   *  'u' - Unknown
   *  ```
   */
  gender: "m" | "f" | "o" | "n" | "u";
  /** Country of the operator as a ISO 3166-1 alpha-2 code (two-letter).
   * @link https://wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  country: string;
  /** Season shorthandle when the operator was first introduced to the game.
   *
   *  As example, `Y1S1` for Year 1 Season 1.
   */
  season: string;
  /** Height of the operator, in cm. */
  height: number;
  /** Weight of the operator, in cm. */
  weight: number;
}

interface OperatorUnlock {
  /** Renown unlock price for operator. */
  renown: 25000 | 20000 | 15000 | 10000 | 1000;
  /** R6 Credits unlock price for operator. */
  r6credits: 600 | 480 | 360 | 240 | 0;
}

interface OperatorBio {
  /** Real name of the operator. */
  realname: string;
  /** Birthplace of the operator, including the country.*/
  birthplace: string;
  /** Emoji corresponding to the country of origin */
  emoji: string;
}
