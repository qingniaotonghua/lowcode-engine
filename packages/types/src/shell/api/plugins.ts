import {
  IPublicApiSkeleton,
  IPublicApiHotkey,
  IPublicApiSetters,
  IPublicApiMaterial,
  IPublicApiEvent,
  IPublicApiProject,
  IPublicApiCommon,
  IPublicApiLogger,
} from './';
import { IPublicModelPlugin, PreferenceValueType } from '../model';
import { IEngineConfig } from '../../engine-config';

export interface IPluginPreferenceMananger {
  // eslint-disable-next-line max-len
  getPreferenceValue: (
    key: string,
    defaultValue?: PreferenceValueType,
  ) => PreferenceValueType | undefined;
}

export interface ILowCodePluginContext {
  get skeleton(): IPublicApiSkeleton;
  get hotkey(): IPublicApiHotkey;
  get setters(): IPublicApiSetters;
  get config(): IEngineConfig;
  get material(): IPublicApiMaterial;
  get event(): IPublicApiEvent;
  get project(): IPublicApiProject;
  get common(): IPublicApiCommon;
  get plugins(): IPublicApiPlugins;
  get logger(): IPublicApiLogger;
  preference: IPluginPreferenceMananger;
}

export interface ILowCodePluginConfig {
  init(): void;
  destroy?(): void;
  exports?(): any;
}

export interface ILowCodeRegisterOptions {
  /**
   * Will enable plugin registered with auto-initialization immediately
   * other than plugin-manager init all plugins at certain time.
   * It is helpful when plugin register is later than plugin-manager initialization.
   */
  autoInit?: boolean;
  /**
   * allow overriding existing plugin with same name when override === true
   */
  override?: boolean;
}

export type PluginOptionsType = string | number | boolean | object;

export interface IPublicApiPlugins {
  register(
    pluginModel: IPublicModelPlugin,
    options?: Record<string, PluginOptionsType>,
    registerOptions?: ILowCodeRegisterOptions,
  ): Promise<void>;

  getPluginPreference(pluginName: string): Record<string, PreferenceValueType> | null | undefined ;
}