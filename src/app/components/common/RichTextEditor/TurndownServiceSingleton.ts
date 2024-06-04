import TurndownService from 'turndown';

class TurndownServiceSingleton {
  private static turndownService: TurndownService;

  private _createTurndownService(): TurndownService {
    const turndownService = new TurndownService();

    TurndownService.prototype.escape = function escape(text: string) {
      return text;
    };

    turndownService.addRule('people-patient-mention', {
      filter: ['span'],
      replacement: (content: string, node: any) => {
        if (node.attributes['data-people-mention']) {
          const alteredValue = `@{${node.attributes['data-people-mention'].nodeValue}}`;
          return alteredValue;
        }
        if (node.attributes['data-patient-mention']) {
          const alteredValue = `#{${node.attributes['data-patient-mention'].nodeValue}}`;
          return alteredValue;
        }
        return content;
      },
    });

    turndownService.addRule('strikethrough', {
      filter: ['del', 's', 'strike'],
      replacement: (content: string) => {
        return `~~${content}~~`;
      },
    });

    turndownService.addRule('underline', {
      filter: ['u'],
      replacement: (content: string) => {
        return `__${content}__`;
      },
    });

    return turndownService;
  }

  public static getTurndownService(): TurndownService {
    if (!TurndownServiceSingleton.turndownService) {
      TurndownServiceSingleton.turndownService =
        new TurndownServiceSingleton()._createTurndownService();
    }
    return TurndownServiceSingleton.turndownService;
  }
}

const turndownService = TurndownServiceSingleton.getTurndownService();
Object.freeze(turndownService);

export default turndownService;
