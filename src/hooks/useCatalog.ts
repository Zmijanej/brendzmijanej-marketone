import { useCallback, useEffect, useState } from 'react'
import { loadProducts } from '../services/productService'
import type { CatalogScenario, CatalogState } from '../types/domain'

export function useCatalog(scenario: CatalogScenario) {
  const [state, setState] = useState<CatalogState>({
    status: 'idle',
    products: [],
  })
  const [requestNumber, setRequestNumber] = useState(0)

  const retry = useCallback(() => {
    setRequestNumber((current) => current + 1)
  }, [])

  useEffect(() => {
    let ignore = false

    queueMicrotask(() => {
      if (!ignore) setState({ status: 'loading', products: [] })
    })

    void loadProducts(scenario)
      .then((products) => {
        if (!ignore) {
          setState({ status: 'success', products })
        }
      })
      .catch((error: unknown) => {
        if (!ignore) {
          setState({
            status: 'error',
            products: [],
            message:
              error instanceof Error
                ? error.message
                : 'Ndodhi një gabim i papritur gjatë ngarkimit.',
          })
        }
      })

    return () => {
      ignore = true
    }
  }, [requestNumber, scenario])

  return { state, retry }
}
