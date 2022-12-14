import {
  IPublicApiHotkey,
  IPublicApiProject,
  IPublicApiSkeleton,
  IPublicApiSetters,
  IPublicApiMaterial,
  IPublicApiEvent,
  IPublicApiCommon,
  CompositeObject,
  IPublicApiPlugins,
  ILowCodePluginConfig,
  IPublicApiLogger,
  PreferenceValueType,
  IEngineConfig,
  IPublicModelPlugin,
} from '@alilc/lowcode-types';

export type PluginPreference = Map<string, Record<string, PreferenceValueType>>;

export interface ILowCodePluginRuntimeCore {
  name: string;
  dep: string[];
  disabled: boolean;
  config: ILowCodePluginConfig;
  logger: IPublicApiLogger;
  on(event: string | symbol, listener: (...args: any[]) => void): any;
  emit(event: string | symbol, ...args: any[]): boolean;
  removeAllListeners(event?: string | symbol): this;
  init(forceInit?: boolean): void;
  isInited(): boolean;
  destroy(): void;
  toProxy(): any;
  setDisabled(flag: boolean): void;
}

interface ILowCodePluginRuntimeExportsAccessor {
  [propName: string]: any;
}

// eslint-disable-next-line max-len
export type ILowCodePluginRuntime = ILowCodePluginRuntimeCore & ILowCodePluginRuntimeExportsAccessor;

export interface ILowCodePluginContextPrivate {
  set hotkey(hotkey: IPublicApiHotkey);
  set project(project: IPublicApiProject);
  set skeleton(skeleton: IPublicApiSkeleton);
  set setters(setters: IPublicApiSetters);
  set material(material: IPublicApiMaterial);
  set event(event: IPublicApiEvent);
  set config(config: IEngineConfig);
  set common(common: IPublicApiCommon);
  set plugins(plugins: IPublicApiPlugins);
  set logger(plugins: IPublicApiLogger);
}
export interface ILowCodePluginContextApiAssembler {
  assembleApis(
    context: ILowCodePluginContextPrivate,
    pluginName: string,
    meta: IPluginMetaDefinition,
  ): void;
}

interface ILowCodePluginManagerPluginAccessor {
  [pluginName: string]: ILowCodePluginRuntime | any;
}

export interface ILowCodePluginManagerCore {
  register(
    pluginModel: IPublicModelPlugin,
    pluginOptions?: any,
    options?: CompositeObject,
  ): Promise<void>;
  init(pluginPreference?: Map<string, Record<string, PreferenceValueType>>): Promise<void>;
  get(pluginName: string): ILowCodePluginRuntime | undefined;
  getAll(): ILowCodePluginRuntime[];
  has(pluginName: string): boolean;
  delete(pluginName: string): any;
  setDisabled(pluginName: string, flag: boolean): void;
  dispose(): void;
}

export type ILowCodePluginManager = ILowCodePluginManagerCore & ILowCodePluginManagerPluginAccessor;

export interface IPluginContextOptions {
  pluginName: string;
  meta: IPluginMetaDefinition;
}

export interface IPluginMetaDefinition {
  /** define dependencies which the plugin depends on */
  dependencies?: string[];
  /** specify which engine version is compatible with the plugin */
  engines?: {
    /** e.g. '^1.0.0' */
    lowcodeEngine?: string;
  };
}