declare type CSSText = string;
/**
 * class
 */
declare class CSSM {
    private readonly cache;
    private readonly style;
    /**
     * `false` with `destroy()`.
     */
    status: boolean;
    /**
     * Remove unused styles.
     */
    update(): void;
    /**
     * Associate a source object with a style.
     * If not yet, append the style element to the DOM.
     */
    attach(id: string, source: any, life: any): void;
    /**
     * Force detachment of the source object from the style.
     */
    detach(href: string, source: any): void;
    /**
     * Check the life of the source; if it is dead, detach it.
     */
    private isDead;
    private findStyle;
    private findCache;
    private find;
    /**
     * Create style.
     */
    create(id: string, cssText: CSSText): void;
    /**
     * Load the style from the URL.
     * Resolve with ID (href) in case of successful loading, or `false` in case of failure.
     */
    load(href: string, requestInit?: RequestInit): Promise<string | false>;
    /**
     * Remove all associations and remove style elements.
     */
    destroy(): void;
}

export { CSSM as default };
