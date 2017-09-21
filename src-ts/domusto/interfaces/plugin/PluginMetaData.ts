export enum PluginCategories {
    temperature,
    heating,
    radio,
    utility,
    system,
    push
}

export interface PluginMetaData {
    plugin: string;
    author: string;
    category: PluginCategories;
    version: string;
    website: string;
}