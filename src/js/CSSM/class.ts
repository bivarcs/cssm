
export type CSSText = string;

export type CacheEntry = {
  id: string
  text: CSSText
}

export type CacheEntryList = Array<CacheEntry>

export type StyleEntry = {
  id: string
  element: HTMLStyleElement
  use: SourceEntryList
}

export type StyleEntryList = Array<StyleEntry>

export type SourceEntry = {
  source: any
  life: Life
}

export type SourceEntryList = Array<SourceEntry>

export type Life = string | ((source: any) => boolean)

/**
 * class
 */
export class CSSM {
  private readonly cache: CacheEntryList = []
  private readonly style: StyleEntryList = [];

  /**
   * `false` with `destroy()`.
   */
  status: boolean

  /**
   * Remove unused styles.
   */
  update() {
    for (let a = this.style, i = 0; a.length > i; i++) {
      let styleEntry = a[i];

      for (let aa = styleEntry.use, ii = 0; aa.length > ii; ii++) {
        let sourceEntry = aa[ii];

        if (this.isDead(sourceEntry)) {
          styleEntry.use.splice(ii--, 1);
        }
      }

      if (!styleEntry.use.length) {
        styleEntry.element.remove();
        this.style.splice(i--, 1);
      }
    }
  }

  /**
   * Associate a source object with a style.
   * If not yet, append the style element to the DOM.
   */
  attach(id: string, source: any, life: any): void {
    const cacheEntry = this.findCache(id);

    if (cacheEntry) {
      var styleEntry = this.findStyle(id);

      if (!styleEntry) {
        const styleE = document.createElement("style");
        styleE.innerHTML = cacheEntry.text;

        this.style.push(styleEntry = {
          id: id,
          element: styleE,
          use: [],
        });
      }

      const styleE = styleEntry.element;

      if (!styleEntry.use.some((entry) => entry.source === source)) {
        const sourceEntry: SourceEntry = {
          source: source,
          life: life
        };

        if (!this.isDead(sourceEntry)) {
          styleEntry.use.push(sourceEntry);
        }
      }

      if (!document.head.contains(styleE)) {
        document.head.appendChild(styleE);
      }
    }
  }

  /**
   * Force detachment of the source object from the style.
   */
  detach(href: string, source: any) {
    const cacheEntry = this.findCache(href);

    if (cacheEntry) {
      const styleEntry = this.findStyle(href);

      if (styleEntry) {
        for (let a = styleEntry.use, i = 0; a.length > i; i++) {
          let entry = a[i];

          if (entry.source === source) {
            styleEntry.use.splice(i--, 1);
          }
        }
      }
    }
  }

  /**
   * Check the life of the source; if it is dead, detach it.
   */
  private isDead(entry: SourceEntry): boolean {
    const { source, life } = entry;

    if ("string" === typeof life) {
      return !source[life];
    } else if ("function" === typeof life) {
      return !life(source);
    }

    return false;
  }

  private findStyle(id: string): StyleEntry | void {
    return this.find("style", id) as StyleEntry | void;
  }

  private findCache(id: string): CacheEntry | void {
    return this.find("cache", id) as CacheEntry | void;
  }

  private find(store: "cache" | "style", id: string): CacheEntry | StyleEntry | void {
    for (let a = this[store], i = 0; a.length > i; i++) {
      let entry = a[i];
      if (entry.id === id) return entry;
    }
  }

  /**
   * Create style.
   */
  create(id: string, cssText: CSSText): void {
    if (!this.cache.some((entry) => entry.id === id)) {
      this.cache.push({
        id: id,
        text: cssText,
      } as CacheEntry);
    }
  }

  /**
   * Load the style from the URL.
   * Resolve with ID (href) in case of successful loading, or `false` in case of failure.
   */
  load(href: string, requestInit?: RequestInit): Promise<string | false> {
    let entry = this.findCache(href);

    return entry ? Promise.resolve(href) : new Promise((resolve) => {
      fetch(href, {
        method: "GET",
        ...(requestInit || {})
      })
        .then((res) => res.text())
        .then((cssText) => {
          this.create(href, cssText);
          resolve(href);
        })
        .catch((err) => {
          console.error(err);
          resolve(false);
        });
    });
  }

  /**
   * Remove all associations and remove style elements.
   */
  destroy(): void {
    this.style.forEach((entry) => {
      entry.element.remove();
    });

    this.cache.length = 0;
    this.style.length = 0;

    this.status = false;
  }
}