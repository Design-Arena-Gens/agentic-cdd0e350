declare module "gtts" {
  export default class gTTS {
    constructor(text: string, lang?: string, slow?: boolean);
    stream(): NodeJS.ReadableStream;
  }
}

