
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = [];


    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} cannot`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "blockIconURI": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAIAAAC1eHXNAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAADwSURBVFhH7dJtDsMgCIDhnWXn6WV7Qkc1MS1+AALGNZr3z5TUJ2s/3/NYoe14VneEENCOd01HudBMJ9Fwivt/RAn36fzJnOy9RAx9B2cGJf4+FnKQ15ADZWIHVJ5etLjyz3zEzMaRuiCNhSbLLB05zsWo7Xjm4hjo3xywkxc6MqnpKBeasY1woH2/eu9lJoX4PqZR6O90IccECu1IP70pLEfacaVwHZArpeLo3Nc5UlZ3oJ17ThSxA1rIYU4ZcUDmlEEHtJDDkIIdoqeLhvtVHGinnxVF64BMKAYOaCGHkmLjgF7q0KShvNGhaTvunccP41vRe+EnFwgAAAAASUVORK5CYII=",
                "id": "rplus",
                "name": "Rounding+",
                "docsURI": "https://docs.google.com/document/d/1lE4RCJhVWZYz7fRUnZN7e1YPTgBa7PbPYo3iklIiyJo/edit?usp=sharing",
                "color1": "#24d600",
                "color2": "#00b815",
                "tbShow": true,
                "blocks": blocks
            }
        }
    }
    blocks.push({
        opcode: `rnttnr`,
        blockType: Scratch.BlockType.REPORTER,
        text: `Round [NUMBER] to the nearest [RNUMBER]`,
        arguments: {
            "NUMBER": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 16,
            },
            "RNUMBER": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`rnttnr`] = async (args, util) => {
        return (args["RNUMBER"] * Math.round((args["NUMBER"] / args["RNUMBER"])))
    };

    blocks.push({
        opcode: `dnrtawrttnr`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `Does [NUMB] round to [ANS] when rounding to the nearest [RNUMB]`,
        arguments: {
            "NUMB": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 16,
            },
            "RNUMB": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
            },
            "ANS": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`dnrtawrttnr`] = async (args, util) => {
        if (Boolean(((args["RNUMB"] * Math.round((args["NUMB"] / args["RNUMB"]))) == args["ANS"]))) {
            return args["true"]

        } else {
            return args["false"]

        };
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
