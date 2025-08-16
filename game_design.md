# Quiz Master Fighter – Design Document

## Game Pillar Doc

**Theme** – *Quiz Master Fighter* throws players into a quirky beat‑’em‑up inspired by pub quizzes and late‑80s arcade brawlers.  The city’s trivia nights have been hijacked by unruly patrons and brainy saboteurs.  Five quizmasters – **Darren**, **Pat**, **Colm**, **John** and **Chris** – step up to defend their favourite haunt.  Each hero sports distinct colours and accessories (from pint glasses to quiz cards) but shares a cohesive retro look: chunky pixels, readable silhouettes and a unified 16–32 colour palette.  The soundtrack mixes chiptune grooves with lighthearted quiz‑show jingles.

**Combat Feel** – Combat remains fast and snappy.  Players can walk, jump, punch, kick and perform a character‑specific special attack (e.g. Darren throws a giant quiz card boomerang; Chris splashes beer to stun foes).  Moves have anticipation and follow‑through frames to convey weight.  Enemies telegraph their attacks so attentive players can react.  Health bars convey remaining hit points【374979486742690†L160-L169】 and flash when characters take damage.  Combos reward consecutive hits; a special meter fills as players land attacks.

**Difficulty Curve** – Stage 1 introduces sluggish drunks and nerds with simple attack patterns, letting players learn controls and discover their favourite character.  Stage 2 ups the challenge with faster nerds, aggressive old men and environmental hazards.  Stage 3 takes a surreal turn: heroes dive into the digital realm to battle a giant smartphone boss.  Each stage lasts roughly five to seven minutes with a smooth increase in enemy variety and frequency.  Because the project uses Phaser – a free, open‑source HTML5 framework that runs in desktop and mobile browsers【308043033539548†L319-L323】 – players can enjoy quick sessions on any device.

**Session Length** – Designed for mobile play, each stage can be completed in a single sitting.  Lives are limited to maintain tension, but generous checkpoints prevent frustration.  Sessions encourage replay: different quizmasters have unique specials and slightly varied stats, inviting experimentation.

## Level Specs

### Stage 1 – “Pub Brawl”

* **Setting** – An inviting Irish pub turned battleground.  The scene scrolls past bar counters, dart boards, outdoor tables and cobbled streets.  Parallax layers include a static evening sky, a row of distant shops, mid‑ground pub windows and a near layer with tables and chairs.
* **Enemy Roster** –
  * **Drunk Guy A** – Tipsy patrons who shamble forward and swing their pints.
  * **Drunk Guy B** – Beer‑bellied brawlers who charge head‑first, attempting to knock players down.
  * **Nerd A** – Quiz geeks who awkwardly throw jabs; they are quick but fragile.
* **Hazards** – Spilled beer creates slick puddles that cause heroes to slip unless they jump.  Bar stools can be picked up and thrown.
* **End** – After clearing waves of drunks and nerds, players exit the pub to a cheering crowd, setting the stage for the next round.

### Stage 2 – “Quiz Hall Chaos”

* **Setting** – A grand community hall with folding tables, trivia posters and a stage.  Parallax layers show rows of seating, curtains and hanging banners.
* **Enemy Roster** – All Stage 1 enemies return with higher frequency, joined by:
  * **Nerd B** – Calculating geniuses who throw handheld calculators like boomerangs; they keep their distance and attack from afar.
  * **Old Man** – Crotchety elders with walking sticks that deliver long‑range pokes; they are tough to knock down.
* **Hazards** – Fallen question cards litter the floor and can be kicked up to hit enemies.  Overhead stage lights occasionally fall, damaging anyone below.
* **End** – Players fend off a massive trivia onslaught; a cut‑scene shows a glitchy smartphone interrupting the quiz, dragging everyone into the digital world.

### Stage 3 – “Digital Den”

* **Setting** – A surreal cyberspace filled with floating trivia cards, neon grids and scrolling code.  Parallax layers include a dark void with glowing question marks, mid‑ground circuit boards and a near layer of animated icons.
* **Enemy Roster** – Digital versions of previous foes appear with pixelated glitches.  Additional hazards include glitchy platforms that disappear periodically.
* **Boss** – **Giant Smartphone** – A towering smart device with a cartoon face on its screen.  It uses app‑themed attacks: **App Slam** (drops from above), **Notification Burst** (flashes to stun) and **Call Ring Knockback** (sonic waves).  The fight has two phases; the phone shatters its screen halfway, revealing a crazed AI core.  Health bars for both player and boss display throughout the fight【374979486742690†L160-L169】.

* **End** – Destroying the smartphone frees the trapped quiz‑goers.  The heroes return to the pub triumphant, ready for another round of trivia.

## Sprite Spec Table

| Asset                    | Size        | Frames per action  | Actions / Notes                                                                                   |
|--------------------------|-------------|--------------------|----------------------------------------------------------------------------------------------------|
| **Darren**               | 64×64 px    | 8–12               | Idle, walk, jump, punch, kick, special (quiz card boomerang), hurt, KO                             |
| **Pat**                  | 64×64 px    | 8–12               | Idle, walk, jump, punch, kick, special (rapid answer‑sheet punches), hurt, KO                      |
| **Colm**                 | 64×64 px    | 8–12               | Idle, walk, jump, punch, kick, special (knowledge energy wave), hurt, KO                           |
| **John**                 | 64×64 px    | 8–12               | Idle, walk, jump, punch, kick, special (flying headbutt), hurt, KO                                 |
| **Chris**                | 64×64 px    | 8–12               | Idle, walk, jump, punch, kick, special (beer splash stun), hurt, KO                                |
| **Drunk Guy A**          | 64×64 px    | 6–8                | Slow walk, swing pint, hurt, KO                                                                    |
| **Drunk Guy B**          | 64×64 px    | 6–8                | Charge attack, stumble recovery, hurt, KO                                                          |
| **Nerd A**               | 64×64 px    | 6–8                | Quick jab, dodge, hurt, KO                                                                         |
| **Nerd B**               | 64×64 px    | 6–8                | Calculator throw, recoil, hurt, KO                                                                 |
| **Old Man**              | 64×64 px    | 6–8                | Walking stick poke, block, hurt, KO                                                                |
| **Smartphone Boss**      | 128×128 px  | 10–14              | Two‑phase fight; telegraphed App Slam, Notification Burst, Call Ring Knockback; damaged state      |
| **Pickups**              | 32×32 px    | 1–2                | Heart (health), star (power‑up), pint glass (temporary boost)                                       |
| **HUD**                  | n/a         | n/a                | Player portraits, health bars, special meters, score and lives counters                            |
| **Parallax tiles**       | 256×128 px  | n/a                | Seamless horizontal tiles for sky, far, mid and near layers across three unique stages             |

### Notes on Generation

* All sprites should be drawn as horizontal strips with consistent frame sizes and no margins.  Feet are aligned within ±2 pixels across frames.  Facing right by default allows the engine to mirror sprites for left movement.
* A limited colour palette and crisp outlines help maintain a cohesive retro look.  Animation frames should include anticipation and follow‑through to add weight.  The smartphone boss requires extra frames for its screen shattering and second phase.
* Assets will be packed into texture atlases for efficient rendering.  Minimising draw calls helps maintain 60 fps on mid‑range phones.
