// Created by Won-Joon Lee on 2022/10/26
// URL: https://github.com/remix-run/react-router/issues/8793

import { useParams } from 'react-router-dom';

type RouteParams = { [K in string]?: string };

type RequiredParams<Key extends string> = {
  readonly [key in Key]: string;
} & Partial<Record<Exclude<string, Key>, string>>;

const hasRequiredParams = <T extends string>(
  params: RouteParams,
  requiredParamNames: readonly T[],
): params is RequiredParams<T> =>
  requiredParamNames.every((paramName) => params[paramName] !== null && params[paramName] !== undefined);

export const useRequiredParams = <T extends string>(requiredParamNames: readonly T[]): Readonly<RequiredParams<T>> => {
  const routeParams = useParams<RouteParams>();

  if (!hasRequiredParams(routeParams, requiredParamNames)) {
    throw new Error(
      [
        `This component should not be rendered on a route since parameter is missing.`,
        `- Required parameters: ${requiredParamNames.join(', ')}`,
        `- Provided parameters: ${JSON.stringify(routeParams)}`,
      ].join('\n'),
    );
  }

  return routeParams;
};
