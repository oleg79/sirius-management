import { Pipe, PipeTransform } from '@angular/core';

const INSTRUMENT_EMOJI_MAP = {
  guitar: '🎸',
  piano: '🎹',
  vocal: '🎙️',
  drums: '🥁'
} as const;

@Pipe({
  name: 'instrumentEmoji'
})
export class InstrumentEmojiPipe implements PipeTransform {

  transform(value: string): string {
    return INSTRUMENT_EMOJI_MAP[value as keyof typeof INSTRUMENT_EMOJI_MAP];
  }
}
