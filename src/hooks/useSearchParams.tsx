// 封装React-router6的useSearchParams，要求传入的范型满足是一个对象
// 将原生的searchParams从Entry类型（Map）转化为对象类型，并封装原生setSearchParams()
import { isEmpty, omitBy } from 'lodash-es'
import { useMemo } from 'react'
import { useSearchParams as useRouterSearchParams } from 'react-router-dom'

export default function useSearchParams<
  Params extends Record<string, unknown>
>() {
  const [searchParams, setSearchParams] = useRouterSearchParams()

  const params = useMemo(
    () => Object.fromEntries(searchParams) as Params,
    [searchParams]
  )
  const setParams = (
    params: Partial<Params> | ((prev: Partial<Params>) => Partial<Params>)
  ) =>
    setSearchParams((prev) => {
      const prevEntries = Object.fromEntries(prev) as Params
      const nextEntries =
        typeof params === 'function' ? params(prevEntries) : params
      // omitBy删除对象中所有值为undefined，null，'' 的属性
      // isEmpty会删除数值类型的属性
      return omitBy(nextEntries, isEmpty) as unknown as Record<string, string>
    })

  return [params, setParams] as const
}
