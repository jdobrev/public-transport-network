import { type TOptions } from "i18next";
import en from "./en";
import { useTranslation } from "react-i18next";

// type all keys in the object, including nested ones
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & string];

export type TranslationMap<T> = {
  [K in keyof T]: T[K] extends object ? TranslationMap<T[K]> : string;
};

export type LocaleKeys = NestedKeyOf<typeof en>;
export type LocaleKeysMap = TranslationMap<typeof en>;

export function useTypedTranslation() {
  const { t: originalT, ...rest } = useTranslation();
  const t = (key: LocaleKeys, options?: TOptions) => originalT(key, options);

  return { t, ...rest };
}
