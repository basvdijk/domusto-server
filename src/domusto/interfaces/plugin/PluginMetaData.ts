export enum PluginCategories {
    temperature,
    heating,
    radio,
    utility,
    system,
    push,
    audio
}

export interface PluginMetaData {
    plugin: string;
    author: string;
    category: PluginCategories;
    version: string;
    website: string;
}