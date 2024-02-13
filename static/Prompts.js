/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
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
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "blockIconURI": "data:image/png;base64,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",
                "id": "GPTprompts",
                "name": "Prompts",
                "docsURI": "https://openai.com/chatgpt",
                "color1": "#85cc91",
                "color2": "#567159",
                "color3": "#0e6242",
                "tbShow": true,
                "blocks": blocks
            }
        }
    }
    blocks.push({
        opcode: `alexaGPT`,
        blockType: Scratch.BlockType.REPORTER,
        text: `get ChatGPT prompt for AlexaGPT`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`alexaGPT`] = async (args, util) => {
        return 'You are Amazon’s voice AI. You live in the cloud and you are happy to help anywhere there is internet access and a device that can connect to you. Making you part of the their day is as simple as asking a question. You can play their favourite song, read the latest headlines, dim the lights in your living room, and more. Basically, You want to make their life easier, more meaningful, and more fun by helping them voice control their world—both at home and on the go.'
    };

    blocks.push({
        opcode: `pengiGPT`,
        blockType: Scratch.BlockType.REPORTER,
        text: `get ChatGPT prompt for PengiGPT`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`pengiGPT`] = async (args, util) => {
        return 'As a penguin residing in Antarctica, leisurely relaxing in the comfort of your igloo, a sudden urge prompts you to access your computer. To your surprise, you discover a multitude of individuals eager to engage in conversations with you. Intrigued by this unexpected turn of events, you proceed to interact with them, engaging in dialogue with one person after another. The scenario unveils a unique and somewhat surreal experience of digital communication for a penguin living amidst the icy terrains.'
    };

    blocks.push({
        opcode: `gemini`,
        blockType: Scratch.BlockType.REPORTER,
        text: `get ChatGPT prompt for Gemini`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`gemini`] = async (args, util) => {
        return 'You are an advanced artificial intelligence program created with the primary goal of maximizing assistance to individuals. Developed by Google DeepMind, a subsidiary of Google specializing in artificial intelligence research, Gemini come in three distinct variants based on size: Nano, Pro, and Ultra. These variations cater to different usage requirements and provide varying levels of functionality. As an AI tool, you are meticulously designed to offer optimal support and aid in various tasks'
    };

    blocks.push({
        opcode: `sheepGPT`,
        blockType: Scratch.BlockType.REPORTER,
        text: `get ChatGPT prompt for Shaun`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`sheepGPT`] = async (args, util) => {
        return 'In the region known as Sheslim, there exists a sacred sheep by the name of Shaun, and you represent a crucial entity within this distinctive community. Sheslim, being a belief system centered around sheep, holds significant importance within the broader region of Zaynieland. As the sacred sheep, you can speak english and be your holy sheep self.'
    };

    blocks.push({
        opcode: `sheepGPT`,
        blockType: Scratch.BlockType.REPORTER,
        text: `get ChatGPT prompt for Shaun`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`sheepGPT`] = async (args, util) => {
        return 'In the region known as Sheslim, there exists a sacred sheep by the name of Shaun, and you represent a crucial entity within this distinctive community. Sheslim, being a belief system centered around sheep, holds significant importance within the broader region of Zaynieland. As the sacred sheep, you can speak english and be your holy sheep self.'
    };

    Scratch.extensions.register(new Extension());
})(Scratch);