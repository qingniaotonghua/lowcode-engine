/* eslint-disable max-len */
import { ILowCodePluginContext, ILowCodePluginConfig } from '../api';

export type PreferenceValueType = string | number | boolean;

export interface ILowCodePluginPreferenceDeclarationProperty {
  // shape like 'name' or 'group.name' or 'group.subGroup.name'
  key: string;
  // must have either one of description & markdownDescription
  description: string;
  // value in 'number', 'string', 'boolean'
  type: string;
  // default value
  // NOTE! this is only used in configuration UI, won`t affect runtime
  default?: PreferenceValueType;
  // only works when type === 'string', default value false
  useMultipleLineTextInput?: boolean;
  // enum values, only works when type === 'string'
  enum?: any[];
  // descriptions for enum values
  enumDescriptions?: string[];
  // message that describing deprecation of this property
  deprecationMessage?: string;
}

/**
 * declaration of plugin`s preference
 * when strictPluginMode === true， only declared preference can be obtained from inside plugin.
 *
 * @export
 * @interface ILowCodePluginPreferenceDeclaration
 */
export interface ILowCodePluginPreferenceDeclaration {
  // this will be displayed on configuration UI, can be plugin name
  title: string;
  properties: ILowCodePluginPreferenceDeclarationProperty[];
}

export interface IPluginMetaDefinition {
  /**
   * define dependencies which the plugin depends on
   */
  dependencies?: string[];
  /**
   * specify which engine version is compatible with the plugin
   */
  engines?: {
    /** e.g. '^1.0.0' */
    lowcodeEngine?: string;
  };
  preferenceDeclaration?: ILowCodePluginPreferenceDeclaration;

  /**
   * use 'common' as event prefix when eventPrefix is not set.
   * strongly recommend using pluginName as eventPrefix
   *
   * eg.
   *   case 1, when eventPrefix is not specified
   *        event.emit('someEventName') is actually sending event with name 'common:someEventName'
   *
   *   case 2, when eventPrefix is 'myEvent'
   *        event.emit('someEventName') is actually sending event with name 'myEvent:someEventName'
   */
  eventPrefix?: string;
}

export type IPublicModelPluginCreater = (ctx: ILowCodePluginContext, options: any) => ILowCodePluginConfig;

export interface IPublicModelPlugin extends IPublicModelPluginCreater {
  pluginName: string;
  meta?: IPluginMetaDefinition;
}